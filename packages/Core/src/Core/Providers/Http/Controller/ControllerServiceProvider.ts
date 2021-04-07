import {Log} from "@Providers/Log/Log";
import {injectable, interfaces} from "inversify";
import Container, {
	AUTHED_USER_IDENTIFIER,
	CONTAINER_IDENTIFIER,
	HTTP_CONTEXT_IDENTIFIER,
	HTTP_REQUEST_IDENTIFIER
} from "../../../Container";
import {AuthorisedUser} from "@Providers/Auth/AuthorisedUser";
import {ServiceProvider} from "@Providers/ServiceProvider";
import {HttpContext} from "../Context/HttpContext";
import {HttpRequest} from "../Context/HttpRequest";
import console from 'chalk-console';
import {Controller} from "./Controller";
import {glob} from "glob";
import path from "path";

@injectable()
export class ControllerServiceProvider extends ServiceProvider {

	registerBindings(){

	}

	boot() {
		this.bindContextToContainer(Container);

		glob
			.sync(
				path.join('src', 'App', 'Http', 'Controllers', '**', '*.ts'),
				{follow : true}
			)
			.map(file => {


					const loc = file
						.replace('src/App/Http/Controllers/', '')
						.replace('.ts', '');

					import(`@App/Http/Controllers/${loc}`)
						.then(module => this.loadController(module, loc))
						.catch(error => {
							Log.warn('[' + this.constructor.name + '] Failed to load controller: ' + file);
							Log.error(error);
						})
			});
	}

	public bindContextToContainer(container: interfaces.Container, context?: HttpContext) {

		if (!context) {
			context = {} as HttpContext;
		}

		container.bind<HttpContext>(HTTP_CONTEXT_IDENTIFIER).toConstantValue(context);
		container.bind<AuthorisedUser>(AUTHED_USER_IDENTIFIER).toConstantValue(context.user);
		container.bind<HttpRequest>(HTTP_REQUEST_IDENTIFIER).toConstantValue(context.request);
		container.bind<interfaces.Container>(CONTAINER_IDENTIFIER).toConstantValue(container);

	}

	private loadController(module: any, file: string) {
		//const controllerModule = require(path.resolve(file))
		const controllerName = Object.keys(module)[0] || null;

		if (!controllerName) {
			throw new Error('There was an error loading controller: ' + file);
		}

		const controller = module[controllerName];

		const name = controller.name;
		if (Container.isBoundNamed(Controller, name)) {
			throw new Error(`Two controllers cannot have the same name: ${name}`);
		}
		Container.bind(Controller).to(controller).whenTargetNamed(name);

		Log.info('Controller Loaded: ' + file)
	}

	allControllers() {
		if (!Container.isBound(Controller)) {
			Log.warn('No controllers have been bound to the container...');
			return;
		}

		return Container.getAll(Controller) || [];
	}

}
