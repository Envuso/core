import {FastifyHookName, Hook, HookHandlerArgs} from "../Hook";

// Handled just before our controllers receive/process the request
export class PreHandlerHook extends Hook {

	protected fastifyHookName(): FastifyHookName {
		return 'preHandler';
	}

	public isAsyncHook() {
		return true;
	}

	public async handleAsync({request, response, payload, error}: HookHandlerArgs): Promise<boolean> {
		return true;
	}

	public handle({request, response, payload, error}: HookHandlerArgs): boolean {
		return true;
	}
}
