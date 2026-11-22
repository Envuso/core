import {RequestContext} from "../../Routing/Context/RequestContext";
import {type HookHandlerArgs} from "../ServerHooks/Hook";
import {OnResponseHook} from "../ServerHooks/HookTypes/OnResponseHook";

/**
 * Set any cookies on the response that have been defined by the user or session middlewares
 */
export class SaveSessionHook extends OnResponseHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		if (!RequestContext.isUsingSession()) {
			return;
		}

		await RequestContext.session().save();
	}

}
