import path from "path";
import {App, ConfigRepository, ServiceProvider} from "../AppContainer";
import {FileLoader, Log} from "../Common";
import {Controller} from "./Controller/Controller";

export class RouteServiceProvider extends ServiceProvider {

	public async register(app: App): Promise<void> {

	}

	public async boot(app: App, config: ConfigRepository): Promise<void> {
		const controllers = await FileLoader.importModulesFrom(
			path.join(config.get('paths.controllers'), '**', '*.ts')
		);

		for (let controller of controllers) {

			if (app.container().isRegistered(controller.instance)) {
				throw new Error('You can not register the same controller more than once. Controller(' + controller.name + ') path: ' + controller.originalPath)
			}

			app.bind(() => {
				return controller.instance;
			}, 'Controllers')

//			app.container().register(controller.instance.prototype, {useValue : controller.instance});
			Log.info('Imported controller: ' + controller.name);

		}
	}

	/**
	 * Get all controllers from the container
	 */
	getAllControllers(): Controller[] {
		return App.getInstance().container().resolveAll('Controllers');
	}

}
