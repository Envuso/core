import {ServiceProvider} from "../AppContainer";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Redis} from "./Redis";

export class RedisServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const redisConfig = config.get<string, any>("Redis");

		app.container().register(Redis, {useValue : new Redis(redisConfig)});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		Redis.getInstance().connect();
	}

	public async unload(app: AppContract, config: ConfigRepositoryContract) {
		await Redis.shutdown();
	}
}
