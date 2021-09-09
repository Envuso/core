import {ServiceProvider} from "../AppContainer";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Redis} from "./Redis";

export class RedisServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const redisConfig = config.get<string, any>("Redis");

		app.container().register(Redis, {useValue: new Redis(redisConfig)});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		Redis.getInstance().connect();
	}
}
