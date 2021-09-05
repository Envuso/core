import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest} from "fastify";
import {METADATA} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {RequestContextStoreContract} from "../../Contracts/Routing/Context/RequestContextStoreContract";
import {SocketConnectionContract} from "../../Contracts/Sockets/SocketConnectionContract";


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

	public bind(request: FastifyRequest | SocketConnectionContract, done: any) {
		this._store.run(Reflect.getMetadata(METADATA.HTTP_CONTEXT, request), done);
	}

}
