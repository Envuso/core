import {AsyncLocalStorage} from "async_hooks";
import type {FastifyRequest} from "fastify";
import type {WebSocketConnectionContract} from "../../WebSockets/WebSocketConnectionContract";
import type {RequestContextContract} from "./RequestContextContract";

export interface RequestContextStoreContract {
	_store: AsyncLocalStorage<RequestContextContract>;

	context(): RequestContextContract;

	store(): AsyncLocalStorage<RequestContextContract>;

	bind(request: FastifyRequest | WebSocketConnectionContract<any>, done: any): void;
}
