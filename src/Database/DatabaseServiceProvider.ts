import {MongoClient} from "mongodb";
import path from 'path';
import pluralize from "pluralize";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {FileLoader, Log} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";
import {Database} from "./Database";
import {getInternallyExcluded} from "./InternalDecorators";
import {ModelDecoratorMeta} from "./ModelDecorators";
import {QueryBuilder} from "./Mongo/QueryBuilder";
import {SeedManager} from "./Seeder/SeedManager";
import {ClassTransformer} from 'class-transformer';

export class DatabaseServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const mongoConfig = config.get<string, any>('Database.mongo');
		const client      = new MongoClient(mongoConfig.url, mongoConfig.clientOptions);
		const connection  = await client.connect();

		app.container().register(MongoClient, {useValue : connection});
		app.container().register(SeedManager, {useValue : new SeedManager()});

		await this.loadModels(app, config, config.get<string, any>('Paths.models'));
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		// Initiate the connection to redis and prep the client for usage
		// new RedisClientInstance(config.get<string, any>('Database.redis'));
	}

	async loadModels(app: AppContract, config: ConfigRepositoryContract, modulePath: string) {
		const log = (message: string) => {
			//if (config.get<string, boolean>('app.logging.models', false)) {
			Log.info(message);
			//}
		};

		const modules = await FileLoader.importClassesOfTypeFrom(
			path.join(modulePath, '**', '*.ts'), 'Model'
		);

		log(`Found ${modules.length} models to load.`);

		const client = app.resolve(MongoClient);
		const dbName = config.get<string, any>('Database.mongo.name');

		const collections     = await client.db(dbName).collections();
		const collectionNames = collections.map(c => c.collectionName);

		for (let module of modules) {
			const collectionName = pluralize(module.name.toLowerCase());

			const collection = client.db(dbName).collection<typeof module.instance>(collectionName);
			if (!collectionNames.includes(collectionName)) {
				log(`Collection ${collectionName} does not exist... creating.`);

				await client.db(dbName).createCollection(collectionName);
				log(`Collection ${collectionName} created successfully.`);
			}

			app.container().register(module.name + 'ModelCollection', {
				useValue : collection
			});

			// Ehhhhh we'll register it to the container in two ways
			const binding = {useValue : module.instance};
			app.container().register(`Model:${module.name}`, binding);
			app.container().register(`Model:${pluralize(module.name.toLowerCase())}`, binding);
			log(`Model: ${module.name} bound to the container`);

			/**
			 * We get the properties defined on the model, excluding any marked with @internalExclude()
			 * then load them into the container so they're available when we need them
			 */
			const modelInst    = new module.instance({fromContainer : true}, true);
			const excludedKeys = Object.keys(getInternallyExcluded(module.instance.prototype as (new () => ModelContract<any>)));
			const fields       = Object.getOwnPropertyNames(modelInst).filter(property => {
				return !excludedKeys.includes(property);
			});

			log(`Attempting to create any index for model: ${module.name}`);
			await (modelInst as any).createIndexes();

			app.container().register(`Model:Fields:${module.name}`, {useValue : fields});
			app.container().register(`Model:QueryBuilder:${module.name}`, {
				useFactory : () => new QueryBuilder(modelInst as any, collection)
			});

		}
	}

	public async unload(app: AppContract, config: ConfigRepositoryContract) {
		const mongoClient = app.container().resolve(MongoClient);

		if (mongoClient) {
			try {
				await mongoClient.close(true);
				Log.info('Successfully closed mongo client connection.');
			} catch (error) {
				Log.error('Failed to close mongo client connection', error);
			}

		}
	}
}
