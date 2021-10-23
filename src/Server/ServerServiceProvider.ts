import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Server} from "./Server";

export class ServerServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().registerSingleton<Server>(Server);
		//app.container().registerSingleton<SocketServer>(SocketServer);
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}


}
