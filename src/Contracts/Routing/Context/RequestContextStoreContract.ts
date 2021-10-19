import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest} from "fastify";
import {SocketConnectionContract} from "../../Sockets/SocketConnectionContract";
import {RequestContract} from "./Request/RequestContract";
import {RequestContextContract} from "./RequestContextContract";

export interface RequestContextStoreContract {
	_store: AsyncLocalStorage<RequestContextContract>;

	context(): RequestContextContract;

	store(): AsyncLocalStorage<RequestContextContract>;

	bind(request: FastifyRequest | RequestContract, done: any): void;
}
