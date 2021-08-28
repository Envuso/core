import {FastifyHookName, Hook, HookHandlerArgs} from "../Hook";

export abstract class OnErrorHook extends Hook {

	protected fastifyHookName(): FastifyHookName {
		return 'onError';
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

