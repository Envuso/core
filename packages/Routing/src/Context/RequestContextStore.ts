import {METADATA} from "@envuso/common";
import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest, HookHandlerDoneFunction} from "fastify";
import {RequestContext} from "./RequestContext";

let instance = null;

export class RequestContextStore {

	private readonly _store: AsyncLocalStorage<RequestContext>;

	constructor() {
		this._store = new AsyncLocalStorage<RequestContext>();

		instance = this;
	}

	static getInstance(): RequestContextStore {
		if (instance) {
			return instance;
		}

		return new RequestContextStore();
	}

	context(): RequestContext {
		return this._store.getStore();
	}

	bind(request: FastifyRequest, done: HookHandlerDoneFunction) {
		this._store.run(Reflect.getMetadata(METADATA.HTTP_CONTEXT, request), done);
	}
}
