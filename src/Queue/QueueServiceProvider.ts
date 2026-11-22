import {ServiceProvider} from "../AppContainer/ServiceProvider";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Log} from "../Common/Logger/Log";
import {Queue} from "./Queue";

export class QueueServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const queueConfig = config.get<string, any>("Queue");

		app.container().register(Queue, {useValue: new Queue(queueConfig)});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		Queue.getInstance().run().catch(error => Log.label('Queue').exception('Queue stopped', error));
	}

	public async unload(app: AppContract, config: ConfigRepositoryContract) {
		await Queue.shutdown();
	}
}
