import {RequestContext} from "../../Routing/Context/RequestContext";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

export class ConvertEmptyStringsToNullHook extends PreHandlerHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		const context = RequestContext.get();

		if (!context) {
			return;
		}

		context.request.convertEmptyStringsToNull();
	}

}
