import {AsyncLocalStorage} from "async_hooks";
import type {FastifyRequest} from "fastify";
import {METADATA} from "../../Common";
import type {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import type {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import type {RequestContextStoreContract} from "../../Contracts/Routing/Context/RequestContextStoreContract";
import type {WebSocketConnectionContract} from "../../Contracts/WebSockets/WebSocketConnectionContract";

let instance = null;

export class RequestContextStore implements RequestContextStoreContract {

	public readonly _store: AsyncLocalStorage<RequestContextContract>;

	constructor() {
		this._store = new AsyncLocalStorage<RequestContextContract>();

		instance = this;
	}

	static getInstance(): RequestContextStoreContract {
		if (instance) {
			return instance;
		}

		return new RequestContextStore();
	}

	public context(): RequestContextContract {
		return this._store.getStore();
	}

	public store(): AsyncLocalStorage<RequestContextContract> {
		return this._store;
	}

	public bind(request: FastifyRequest | WebSocketConnectionContract<any>, done: any) {
		const cont = Reflect.getMetadata(METADATA.HTTP_CONTEXT, request);

		this._store.run(cont, done);
	}

}
