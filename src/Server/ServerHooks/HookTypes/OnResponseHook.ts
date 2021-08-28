import {FastifyHookName, Hook, HookHandlerArgs} from "../Hook";

export class OnResponseHook extends Hook {

	protected fastifyHookName(): FastifyHookName {
		return 'onResponse';
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
