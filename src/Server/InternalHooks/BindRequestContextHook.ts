import {RequestContext} from "../../Routing/Context/RequestContext";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

/**
 * This hook will bind our request context to fastify
 * Our request context stores fastify's request/reply for this request
 * It will also store our authorised user if any and more...
 *
 * Without RequestContext, we can't have certain parts of the framework
 * work with each user/request that we get hit with.
 */
export class BindRequestContextHook extends PreHandlerHook {

	public isAsyncHook(): boolean {
		return false;
	}

	public handle({request, response, payload, error, done}: HookHandlerArgs): boolean {
		if ((request as any).corsPreflightEnabled) {
			done();
			return;
		}

		(new RequestContext(request, response)).bindToFastify(done);
	}

}
