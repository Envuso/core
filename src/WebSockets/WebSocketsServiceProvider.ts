import {ServiceProvider} from "../AppContainer";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {WebSocketServer} from "./WebSocketServer";

export class WebSocketsServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().registerSingleton(WebSocketServer);
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		await app.container().resolve(WebSocketServer).boot(config.get('websockets'));
	}

	public async unload(app: AppContract, config: ConfigRepositoryContract) {
		await app.container().resolve(WebSocketServer).unload();
	}

}
