import {config, resolve} from "../../AppContainer";
import Environment from "../../AppContainer/Config/Environment";
import {RouteHelper} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
//import {ApplicationRouteAttributeObject} from "../../Meta/ApplicationRouteMeta";
import {Middleware} from "../Middleware/Middleware";

export class InjectViewGlobals extends Middleware {

	public async handle(context: RequestContextContract): Promise<any> {
		const viewManager = resolve<ViewManagerContract>('ViewManager');
		viewManager.registerGlobal(
			'route', <T extends string>(routeStr: T, attributes?: any) => RouteHelper.urlFor(routeStr, attributes)
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
