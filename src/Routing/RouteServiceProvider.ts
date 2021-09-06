import path from "path";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {FileLoader, Log} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {ViewManager} from "./Views/ViewManager";

export class RouteServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register('ViewManager', {useFactory : () => new ViewManager()});

		const controllers = await FileLoader.importModulesFrom(
			path.join(config.get<string, any>('Paths.controllers'), '**', '*.ts')
		);

		const controllerMeta: any = {};

		for (let controller of controllers) {

			if (app.container().isRegistered(controller.instance)) {
				throw new Error('You can not register the same controller more than once. Controller(' + controller.name + ') path: ' + controller.originalPath);
			}

			controllerMeta[controller.name] = {
				name : controller.name,
				path : controller.originalPath,
			};

			app.bind(() => {
				return controller.instance;
			}, 'Controllers');

			//			app.container().register(controller.instance.prototype, {useValue : controller.instance});
			Log.info('Imported controller: ' + controller.name);

		}

		app.container().register('controller.meta', {useValue : controllerMeta});
	}

}
