import {ServiceProvider} from "../../AppContainer/ServiceProvider";
import type {AppContract} from "../../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../../Contracts/AppContainer/Config/ConfigRepositoryContract";
import type {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import {resolve} from "../../AppContainer/helpers";
import {inertiaViewHelperGlobal} from "./InertiaViewHelperGlobal";

export class InertiaServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		if (!config.has('inertia.rootView')) {
			config.set('inertia.rootView', 'index');
		}
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		// {{{ inertia(page) }}} in the root view (needs the view layer: RouteServiceProvider)
		if (app.container().isRegistered('ViewManager')) {
			resolve<ViewManagerContract>('ViewManager').registerGlobal('inertia', inertiaViewHelperGlobal);
		}
	}

}
