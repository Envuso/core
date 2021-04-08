import {METADATA} from "@Core";
import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest, HookHandlerDoneFunction} from "fastify";
import {HttpContext} from "./HttpContext";

let instance = null;

export class HttpContextStore {

	private readonly _store: AsyncLocalStorage<HttpContext>;

	constructor() {
		this._store = new AsyncLocalStorage<HttpContext>();

		instance = this;
	}

	static getInstance(): HttpContextStore {
		if (instance) {
			return instance;
		}

		return new HttpContextStore();
	}

	context(): HttpContext {
		return this._store.getStore();
	}

	bind(request: FastifyRequest, done: HookHandlerDoneFunction) {
		this._store.run(Reflect.getMetadata(METADATA.HTTP_CONTEXT, request), done);
	}
}
