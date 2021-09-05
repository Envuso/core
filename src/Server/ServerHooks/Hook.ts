import {DoneFuncWithErrOrRes, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import Reply from "fastify/lib/reply.js";
import Request from "fastify/lib/request.js";
import {RequestPayload} from "fastify/types/hooks";
import {Log} from "../../Common";
import {HookContract} from "../../Contracts/Server/ServerHooks/HookContract";

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
		fastify.addHook(
			//@ts-ignore
			this.fastifyHookName(),
			this.isAsyncHook()
				? async (...args) => {
					await this.handleAsync(this.getHookArgs(...args));
				}
				: (...args) => {
					this.handle(this.getHookArgs(...args));
				}
		);

		Log.success('Successfully registered server hook: ' + this.constructor.name);
	}

	public getHookArgs(...args): HookRunnerArgs {
		const handleObject: any = {};

		for (let arg of args) {
			switch (true) {
				case (arg instanceof Request):
					handleObject.request = arg;
					break;
				case (arg instanceof Reply):
					handleObject.response = arg;
					break;
				case (typeof arg === 'function' && arg?.name === 'next'):
					handleObject.done = arg;
					break;
				case (typeof arg === 'string'):
					handleObject.payload = arg;
					break;
				default:
					handleObject.error = arg;
			}
		}

		return handleObject;
	}

}
