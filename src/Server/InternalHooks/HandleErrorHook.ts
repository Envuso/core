import {HookHandlerArgs, OnSendHook} from "../ServerHooks";

/**
 * If our application has any unhandled errors, we'll log an exception here.
 */
export class HandleErrorHook extends OnSendHook {

	public isAsyncHook(): boolean {
		return false;
	}

	public handle({request, response, payload, error, done}: HookHandlerArgs): boolean {
		//	Log.exception(error.message, error);
		done();

		return true;
	}

}
