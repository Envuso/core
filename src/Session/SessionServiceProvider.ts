import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {Classes} from "../Common";
import Log from "../Common/Logger/Log";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {SessionManagerContract} from "../Contracts/Session/SessionManagerContract";
import {FileSessionDriver} from "./Drivers/FileSessionDriver";
import {SessionManager} from "./SessionManager";

export class SessionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register('SessionManager', {
			useFactory : () => {
				return new SessionManager(config.get('Session'));
			}
		});
	}

	// Run an hourly session file cleanup
	public boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const manager = app.container().resolve<SessionManagerContract>('SessionManager');
		if (Classes.getConstructorName(manager.storageDriver) !== 'FileSessionDriver') {
			return;
		}

		const storageDriver = manager.storageDriver as FileSessionDriver;

		Log.label("Sessions").info('Running session file cleanup.');
		FileSessionDriver.cleanOldSessionFiles();

		setInterval(async () => {
			Log.label("Sessions").info('Running session file cleanup.');
			await FileSessionDriver.cleanOldSessionFiles();
		}, 3.6e+6);
	}

}
