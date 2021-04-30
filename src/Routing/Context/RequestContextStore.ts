import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest} from "fastify";
import {METADATA} from "../../Common";
import {SocketConnection} from "../../Sockets/SocketConnection";
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

	bind(request: FastifyRequest|SocketConnection, done: any) {
		this._store.run(Reflect.getMetadata(METADATA.HTTP_CONTEXT, request), done);
	}

}
