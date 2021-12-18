import {HookHandlerContract} from "../../../Contracts/Server/ServerHooks/HookTypes/HookHandlerContract";
import {FastifyHookName, Hook, HookHandlerArgs} from "../Hook";

export class OnTimeoutHook extends Hook implements HookHandlerContract {

	public fastifyHookName(): FastifyHookName {
		return 'onTimeout';
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
