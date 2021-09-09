import {MongoClient, MongoError} from "mongodb";
import path from 'path';
import pluralize from "pluralize";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {FileLoader} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {SeedManager} from "./Seeder/SeedManager";

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

		const modules = await FileLoader.importClassesOfTypeFrom(
			path.join(modulePath, '**', '*.ts'), 'Model'
		);

		const client = app.resolve(MongoClient);
		const dbName = config.get<string, any>('Database.mongo.name');

		for (let module of modules) {
			const collection = client.db(dbName).collection<typeof module.instance>(
				pluralize(module.name.toLowerCase())
			);

			app.container().register(module.name + 'ModelCollection', {
				useValue : collection
			});

			// Ehhhhh we'll register it to the container in two ways
			const binding = {useValue : module.instance};
			app.container().register(`Model:${module.name}`, binding);
			app.container().register(`Model:${pluralize(module.name.toLowerCase())}`, binding);
		}
	}

	public async unload(app: AppContract, config: ConfigRepositoryContract) {
		const mongoClient = app.container().resolve(MongoClient);

		if (mongoClient) {
			try {
				await mongoClient.close(true);

				console.log('Successfully closed mongo client connection.');
			} catch (error) {
				console.error('Failed to close mongo client connection', error);
			}

		}

		await RedisClientInstance.shutdown();
	}
}
