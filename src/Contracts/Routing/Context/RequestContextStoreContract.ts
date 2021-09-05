import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest} from "fastify";
import {SocketConnectionContract} from "../../Sockets/SocketConnectionContract";
import {RequestContextContract} from "./RequestContextContract";

export interface RequestContextStoreContract {
	_store: AsyncLocalStorage<RequestContextContract>;

	context(): RequestContextContract;

	bind(request: FastifyRequest | SocketConnectionContract, done: any): void;
}
