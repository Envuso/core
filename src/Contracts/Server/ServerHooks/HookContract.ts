import {FastifyInstance} from "fastify";
import {FastifyHookName, HookHandlerArgs, HookRunnerArgs} from "../../../Server/ServerHooks";

export interface HookContract {
	fastifyHookName(): FastifyHookName;

	isAsyncHook(): boolean;

	handle({request, response, error, payload}: HookHandlerArgs): boolean;

	handleAsync({request, response, error, payload}: HookHandlerArgs): Promise<boolean>;

	hookHandler({request, response, done, error, payload}: HookRunnerArgs): void;

	register(fastify: FastifyInstance): void;

	getHookArgs(...args): HookRunnerArgs;
}
