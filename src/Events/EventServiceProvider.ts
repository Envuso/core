import path from "path";
import {App, config, ConfigRepository, ServiceProvider} from "../AppContainer";
import {FileLoader} from "../Common";
import {EventDispatcher} from "./EventDispatcher";
import { EventListener } from "./EventListener";
import {EventManager} from "./EventManager";


export class EventServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {

		const dispatchers = await FileLoader.importModulesFrom<EventDispatcher>(
			path.join(config.get('paths.eventDispatchers'), '**', '*.ts')
		);

		const listeners = await FileLoader.importModulesFrom<EventListener>(
			path.join(config.get('paths.eventListeners'), '**', '*.ts')
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

	public async boot(app: App, config: ConfigRepository) {

	}

}
