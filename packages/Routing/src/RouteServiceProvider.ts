import {App, ConfigRepository, injectable, ServiceProvider} from "@envuso/app";
import {classAndNameFromModule, loadModulesFromPath} from "@envuso/common";
import {Log} from "@envuso/common/dist/src/Logger/Log";
import path from "path";
import {glob} from "glob";
import {Controller} from "./Controller/Controller";

export class RouteServiceProvider extends ServiceProvider {

	public async register(app: App): Promise<void> {
//		app.bind(() => {
//			return new RouteServiceProvider();
//		});
	}

	public async boot(app: App, config: ConfigRepository): Promise<void> {
		const controllers = loadModulesFromPath(
			path.join(config.get('paths.controllers'), '**', '*.ts')
		);

//		const controllers = await glob.sync(
//			path.join(config.get('paths.controllers'), '**', '*.ts'),
//			{follow : true}
//		)

		for (let controllerPath of controllers) {
			await this.bindController(app, controllerPath)
		}
	}

	/**
	 * Bind a controller to the container so it's initiated
	 * and ready to accept a request when ever one comes in.
	 *
	 * @param app
	 * @param controllerPath
	 */
	public async bindController(app: App, controllerPath: string) {
		try {
			const module = await import(controllerPath);


			const {instance, name} = classAndNameFromModule(module)

			Log.info('Imported controller: ' + name);

//			const moduleName = Object.keys(module).shift() || null;
//
//			if (!moduleName) {
//				throw new Error('Cannot get module name from imported controller: ' + controllerPath);
//			}
//
//			const controllerClass = module[moduleName];

			if (app.container().isRegistered(instance)) {
				throw new Error('You can not register the same controller more than once. Controller(' + name + ') path: ' + controllerPath)
			}

			app.bind(() => {
				return new instance();
			}, 'Controllers')

		} catch (error) {
			console.error('Failed to load controller: ' + controllerPath, error);
		}
	}

	/**
	 * Get all controllers from the container
	 */
	getAllControllers(): Controller[] {
		return App.getInstance().container().resolveAll('Controllers');
	}

}
