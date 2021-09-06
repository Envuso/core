import {ServiceProvider} from "../../AppContainer";
import {AppContract} from "../../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import edge, {EdgeBufferContract, ParserContract, TagTokenContract, TemplateConstructorContract} from 'edge.js';

export class InertiaServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		if (!config.has('inertia.rootView')) {
			config.set('inertia.rootView', 'index');
		}
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
