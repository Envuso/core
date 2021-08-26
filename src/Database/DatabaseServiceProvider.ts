import {MongoClient} from "mongodb";
import pluralize from "pluralize";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {App, app, ConfigRepository, resolve} from "../AppContainer";
import {FileLoader} from "../Common";
import {MongoConnectionConfiguration} from "../Config/Database";
import path from 'path';
import {SeedManager} from "./Seeder/SeedManager";
import {RedisClientInstance} from "./Redis/RedisClientInstance";

export class DatabaseServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		const mongoConfig = config.get<MongoConnectionConfiguration>('database.mongo');
		const client      = new MongoClient(mongoConfig.url, mongoConfig.clientOptions);
		const connection  = await client.connect();

		app.container().register(MongoClient, {useValue : connection});
		app.container().register(SeedManager, {useValue : new SeedManager()});

		await this.loadModels(config.get('paths.models'));
	}

	public async boot(app: App, config: ConfigRepository) {

		// Initiate the connection to redis and prep the client for usage
		RedisClientInstance.get();

	}

	async loadModels(modulePath: string) {
		const modules = await FileLoader.importModulesFrom(
			path.join(modulePath, '**', '*.ts')
		);
		const client  = resolve(MongoClient);
		const dbName  = resolve(ConfigRepository).get<string>('database.mongo.name');

		for (let module of modules) {
			const collection = client.db(dbName).collection<typeof module.instance>(
				pluralize(module.name.toLowerCase())
			);

			app().container().register(module.name + 'Model', {
				useValue : collection
			});
		}
	}
}
