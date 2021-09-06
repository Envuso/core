import {MongoClient} from "mongodb";
import path from 'path';
import pluralize from "pluralize";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {FileLoader} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {RedisClientInstance} from "./Redis/RedisClientInstance";
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
		new RedisClientInstance(config.get<string, any>('Database.redis'));
	}

	async loadModels(app: AppContract, config: ConfigRepositoryContract, modulePath: string) {
		const modules = await FileLoader.importModulesFrom(
			path.join(modulePath, '**', '*.ts')
		);
		const client  = app.resolve(MongoClient);
		const dbName  = config.get<string, any>('Database.mongo.name');

		for (let module of modules) {
			const collection = client.db(dbName).collection<typeof module.instance>(
				pluralize(module.name.toLowerCase())
			);

			app.container().register(module.name + 'Model', {
				useValue : collection
			});
		}
	}
}
