import {App, ConfigRepository, injectable, ServiceProvider} from "@envuso/app";
import {FileLoader} from "@envuso/common";
import {Log} from "@envuso/common/dist/src/Logger/Log";
import path from "path";
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
				return new controller.instance();
			}, 'Controllers')

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
