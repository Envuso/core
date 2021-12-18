import {FastifyHookName, HookHandlerArgs} from "../../../../Server/ServerHooks";

export interface HookHandlerContract {
	fastifyHookName(): FastifyHookName;

	isAsyncHook(): boolean;

	handleAsync({request, response, payload, error}: HookHandlerArgs): Promise<boolean>;

	handle({request, response, payload, error}: HookHandlerArgs): boolean;
}
