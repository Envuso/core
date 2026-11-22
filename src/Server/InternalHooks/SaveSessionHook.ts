import {RequestContext} from "../../Routing/Context/RequestContext";
import type {HookHandlerArgs} from "../ServerHooks/Hook";
import {OnSendHook} from "../ServerHooks/HookTypes/OnSendHook";

/**
 * Save the session before the response is sent.
 *
 * (It used to run in onResponse, after the client already had the response, so a quick
 * follow-up request could read the session before this request's changes were written.)
 */
export class SaveSessionHook extends OnSendHook {

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
