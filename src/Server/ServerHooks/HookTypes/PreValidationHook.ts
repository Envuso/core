import type {HookHandlerContract} from "../../../Contracts/Server/ServerHooks/HookTypes/HookHandlerContract";
import {type FastifyHookName, Hook, type HookHandlerArgs} from "../Hook";

export class PreValidationHook extends Hook implements HookHandlerContract {

	public fastifyHookName(): FastifyHookName {
		return 'preValidation';
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
