import {app, App, ConfigRepository, resolve, ServiceProvider} from "@envuso/app";
import {classAndNameFromModule, loadModulesFromPath} from "@envuso/common";
import {MongoClient} from "mongodb";
import pluralize from "pluralize";
import {MongoConnectionConfiguration} from "../Config/Database";
import path from 'path';

export class DatabaseServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		const mongoConfig = config.get<MongoConnectionConfiguration>('database.mongo');
		const client      = new MongoClient(mongoConfig.url, mongoConfig.clientOptions);
		const connection  = await client.connect();

		app.container().register(MongoClient, {useValue : connection});

		await this.loadModels(config.get('paths.models'));
	}

	public async boot(app: App, config: ConfigRepository) {


	}

	async loadModels(modulePath: string) {
		const paths = loadModulesFromPath(
			path.join(modulePath, '**', '*.ts')
		);

		const client = resolve(MongoClient);
		const dbName = resolve(ConfigRepository).get<string>('database.mongo.name');

		for (let path of paths) {
			const module = await import(path);

			const {instance, name} = classAndNameFromModule(module);

			const collection = client.db(dbName).collection<typeof instance>(
				pluralize(name.toLowerCase())
			);

			app().container().register(instance, {
				useValue : collection
			});
		}
	}
}
