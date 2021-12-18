import {resolve} from "../../AppContainer";
import Environment from "../../AppContainer/Config/Environment";
import {Url} from "../../Common/Utility/Url";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import {Middleware} from "../Middleware/Middleware";

export class InjectViewGlobals extends Middleware {

	public async handle(context: RequestContextContract): Promise<any> {
		const viewManager = resolve<ViewManagerContract>('ViewManager');
		viewManager.registerGlobal('route',
			<T extends string>(controllerAndMethod: T, attributes?: any) => Url.routeUrl(controllerAndMethod, attributes)
		);
		viewManager.registerGlobal(
			'old', (key?: string, _default: any = null) => context.request.old(key, _default)
		);

		viewManager.registerGlobal('session', () => context.session.store().items());
		viewManager.registerGlobal('isDevelopment', () => Environment.isDev());
		viewManager.registerGlobal('csrfToken', () => context.session.getCsrfToken());
		viewManager.registerGlobal('csrfField', () => `<input type="hidden" name="csrf_token" value="${context.session.getCsrfToken()}">`);
	}

}
