import {AsyncLocalStorage} from "async_hooks";
import {FastifyRequest} from "fastify";
import {WebSocketConnectionContract} from "../../WebSockets/WebSocketConnectionContract";
import {RequestContextContract} from "./RequestContextContract";

export interface RequestContextStoreContract {
	_store: AsyncLocalStorage<RequestContextContract>;

	context(): RequestContextContract;

	store(): AsyncLocalStorage<RequestContextContract>;

	bind(request: FastifyRequest | WebSocketConnectionContract<any>, done: any): void;
}
