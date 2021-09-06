import path from "path";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {FileLoader} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {EventDispatcher} from "./EventDispatcher";
import {EventListener} from "./EventListener";
import {EventManager} from "./EventManager";


export class EventServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

		const conf = config.get('Paths.eventDispatchers');

		const dispatchers = await FileLoader.importModulesFrom<EventDispatcher>(
			path.join(config.get('Paths.eventDispatchers'), '**', '*.ts')
		);

		const listeners = await FileLoader.importModulesFrom<EventListener>(
			path.join(config.get('Paths.eventListeners'), '**', '*.ts')
		);

		const eventManager = new EventManager(
			dispatchers.map(({name, instance}) => ({name, instance})),
			listeners.map(({name, instance}) => ({name, instance}))
		);

		eventManager.prepare();

		app.container().register(EventManager, {
			useFactory : () => eventManager
		});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
