import {ServiceProvider} from "../AppContainer";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Queue} from "./Queue";

export class QueueServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const queueConfig = config.get<string, any>("Queue");

		app.container().register(Queue, {useValue: new Queue(queueConfig)});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		// noinspection ES6MissingAwait
		Queue.getInstance().run();
	}
}
