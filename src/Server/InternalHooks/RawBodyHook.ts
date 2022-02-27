import getRawBody from "raw-body";
import Log from "../../Common/Logger/Log";
import {HookHandlerArgs, OnRequestHook} from "../ServerHooks";

export class RawBodyHook extends OnRequestHook {

	public isAsyncHook(): boolean {
		return true;
	}

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		if ((request as any).corsPreflightEnabled) {
			done();
			return;
		}

		try {
			request['rawBody'] = await getRawBody(request.raw, {encoding : 'utf-8'});
		} catch (error) {
			request['rawBody'] = null;
			Log.exception('Failed to process raw body.', error);
		}
	}

}
