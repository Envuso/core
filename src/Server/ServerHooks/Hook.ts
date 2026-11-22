import type {DoneFuncWithErrOrRes, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import type {RequestPayload} from "fastify/types/hooks";
import {config} from "../../AppContainer/helpers";
import {Log} from "../../Common/Logger/Log";
import type {HookContract} from "../../Contracts/Server/ServerHooks/HookContract";
import {OnErrorHook} from "./HookTypes/OnErrorHook";
import {OnRequestHook} from "./HookTypes/OnRequestHook";
import {OnResponseHook} from "./HookTypes/OnResponseHook";
import {OnSendHook} from "./HookTypes/OnSendHook";
import {OnTimeoutHook} from "./HookTypes/OnTimeoutHook";
import {PreHandlerHook} from "./HookTypes/PreHandlerHook";
import {PreParsingHook} from "./HookTypes/PreParsingHook";
import {PreSerializationHook} from "./HookTypes/PreSerializationHook";
import {PreValidationHook} from "./HookTypes/PreValidationHook";

export type FastifyHookName =
	'onRequest'
	| 'preParsing'
	| 'preValidation'
	| 'preHandler'
	| 'preSerialization'
	| 'onSend'
	| 'onResponse'
	| 'onTimeout'
	| 'onError'

export type FastifyHandlerHookMap = {
	'onRequest': (request: FastifyRequest, response: FastifyReply) => Promise<boolean>,
	'preParsing': (request: FastifyRequest, response: FastifyReply, payload: RequestPayload) => Promise<boolean>,
	'preValidation': (request: FastifyRequest, response: FastifyReply) => Promise<boolean>,
	'preHandler': (request: FastifyRequest, response: FastifyReply) => Promise<boolean>,
	'preSerialization': (request: FastifyRequest, response: FastifyReply, payload: any) => Promise<boolean>,
	'onSend': (request: FastifyRequest, response: FastifyReply, payload: any) => Promise<boolean>,
	'onResponse': (request: FastifyRequest, response: FastifyReply) => Promise<boolean>,
	'onTimeout': (request: FastifyRequest, response: FastifyReply) => Promise<boolean>,
	'onError': (request: FastifyRequest, response: FastifyReply, error: Error) => Promise<boolean>,
}

export type HookRunnerArgs = { request: FastifyRequest, response: FastifyReply, done: DoneFuncWithErrOrRes, error?: Error, payload?: any }
export type HookHandlerArgs = { request: FastifyRequest, response: FastifyReply, error?: Error, payload?: any, done?: DoneFuncWithErrOrRes }

export type HookTypes = OnErrorHook | OnRequestHook | OnResponseHook | OnSendHook | OnTimeoutHook | PreHandlerHook | PreParsingHook | PreSerializationHook | PreValidationHook;

export class Hook implements HookContract {

	public fastifyHookName(): FastifyHookName {
		return null;
	}

	public isAsyncHook(): boolean {
		return true;
	}

	public handle({request, response, error, payload}: HookHandlerArgs): boolean {
		return true;
	}

	public async handleAsync({request, response, error, payload}: HookHandlerArgs): Promise<boolean> {
		return true;
	}

	public hookHandler({request, response, done, error, payload}: HookRunnerArgs) {
		if (!this.isAsyncHook()) {
			this.handle({request, response, payload, error, done});
			return;
		}

		this.handleAsync({request, response, payload, error})
			.then((result) => {
				done(
					//@ts-ignore
					(error !== undefined ? error : null),
					(payload !== undefined ? payload : null),
				);
			})
			.catch(error => {
				Log.exception('Failed to process hook: ' + this.fastifyHookName(), error);
				done(error, null);
			});
	}

	public register(fastify: FastifyInstance) {
		const hookName = this.fastifyHookName();

		fastify.addHook(
			hookName as any,
			this.isAsyncHook()
				? async (request: FastifyRequest, response: FastifyReply, ...rest: any[]) => {
					await this.handleAsync(Hook.hookArgs(hookName, request, response, rest[0]));
				}
				: (request: FastifyRequest, response: FastifyReply, third?: any, fourth?: any) => {
					this.handle(Hook.hookArgs(hookName, request, response, third, fourth));
				}
		);

		if (config('app.logging.serverHooks', false)) {
			Log.success('Successfully registered server hook: ' + this.constructor.name);
		}
	}

	/**
	 * Map Fastify's positional hook arguments onto our named args.
	 *
	 * Fastify's hook signatures are fixed per hook name:
	 *  - preParsing/preSerialization/onSend: (request, reply, payload, done)
	 *  - onError:                            (request, reply, error, done)
	 *  - everything else:                    (request, reply, done)
	 */
	public static hookArgs(hookName: FastifyHookName, request: FastifyRequest, response: FastifyReply, third?: any, fourth?: any): HookRunnerArgs {
		switch (hookName) {
			case 'preParsing':
			case 'preSerialization':
			case 'onSend':
				return {request, response, payload : third, done : fourth};
			case 'onError':
				return {request, response, error : third, done : fourth};
			default:
				return {request, response, done : third};
		}
	}

}
