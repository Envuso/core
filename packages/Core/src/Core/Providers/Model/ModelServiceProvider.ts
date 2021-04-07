import {Log} from "@Providers/Log/Log";
import {ModelEntity} from "@Providers/Model/ModelEntity";
import {ClassType, Repository} from "@Core/Providers";
import {ServiceProvider} from "../ServiceProvider";
import {injectable} from "inversify";
import path from "path";
import {glob} from "glob";
import {Config} from "@Config";
import {MongoClient} from "mongodb";
import Container from "../../Container";
import pluralize from 'pluralize';

export interface ModelServiceProviderCachedModel {
	name: string;
	location: string;
	import: string;
	originalLocation: string;
}

@injectable()
export class ModelServiceProvider extends ServiceProvider {

	private models: ModelServiceProviderCachedModel[] = [];

	public async registerBindings() {

		const models = this.getModels();

		for (let model of models) {
			try {
				const module = await import(`@App/Models/${model.location}`);

				this.loadModel(module, model.name)
			} catch (error) {
				Log.warn('[' + this.constructor.name + '] Failed to load model: ' + model.originalLocation);
				Log.error(error);
			}
		}

	}

	async boot() {
		await this.setupDatabase();
		this.setupEntityRepositories();
	}

	getModels(): ModelServiceProviderCachedModel[] {
		const models = glob.sync(
			path.join('src', 'App', 'Models', '**', '*.ts'),
			{follow : true}
		);

		return models.map(model => {
			const location = model
				.replace('src/App/Models/', '')
				.replace('.ts', '');

			const name = location.split('/').pop();

			return {
				name,
				location,
				import           : `@App/Models/${location}`,
				originalLocation : model
			};
		});
	}

	private async setupDatabase() {
		const client = new MongoClient(Config.database.mongo.connectionUrl, {
			useNewUrlParser    : true,
			useUnifiedTopology : true
		});

		const connection = await client.connect();

		Container.bind<MongoClient>(MongoClient).toConstantValue(connection);
	}

	private setupEntityRepositories() {
		const models: ModelEntity<any>[] = Container.getAll(ModelEntity);

		for (let model of models) {

			const repository = new Repository<typeof model>(
				model.constructor as ClassType<typeof model>,
				Container.get<MongoClient>(MongoClient),
				pluralize(model.constructor.name.toLowerCase())
			);

			Container.bind(model.constructor).toConstantValue(repository);
		}
	}

	private loadModel(module, loc: string) {
		const modelName = Object.keys(module)[0] || null;

		if (!modelName) {
			throw new Error('There was an error loading model: ' + loc);
		}

		const model = module[modelName];

		Container.bind(ModelEntity).to(model).whenTargetNamed(modelName);

		Log.info('Model loaded: ' + loc)
	}

	modelExists(name: string) {
		return this.models.find(model => model.name === name);
	}
}
