import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {FastifyInstance, FastifyPlugin, FastifyPluginOptions, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import {FastifyCorsOptions} from "fastify-cors";
import {Exception} from "../../Common";
import {HookTypes} from "../../Server/ServerHooks";
import {RequestContextContract} from "../Routing/Context/RequestContextContract";
import {ResponseContract} from "../Routing/Context/Response/ResponseContract";
import {MiddlewareContract} from "../Routing/Middleware/MiddlewareContract";
import {HookContract} from "./ServerHooks/HookContract";

export interface CorsConfiguration {
	enabled: boolean;
	options: FastifyCorsOptions;
}

export interface ServerConfiguration {
	port: number;
	middleware: (new () => MiddlewareContract)[];
	disableCookieEncryption: string[];
	cors: { options: FastifyCorsOptions; enabled: boolean };
	hooks: Array<HookTypes>,
	fastifyPlugins: Array<[FastifyPlugin, FastifyPluginOptions]>;
	fastifyOptions: FastifyServerOptions;
	responseSerialization: ClassTransformOptions;
}

export type ErrorHandlerFn = (exception: Error, request: FastifyRequest, reply: FastifyReply) => Promise<ResponseContract>;

export interface ServerContract {
	_server: FastifyInstance;
	_customErrorHandler: ErrorHandlerFn | null;
	_config: ServerConfiguration;

	/**
	 * Initialise fastify, add all routes to the application and apply any middlewares
	 */
	initialise(): Promise<any>;

	/**
	 * Register all controller routes inside fastify
	 *
	 * @private
	 */
	registerRoutes(): void;

	registerHooks(hooks: { new(): HookContract }[]): void;

	/**
	 * This will register app Fastify Plugins from Config/App.ts > fastifyPlugins
	 *
	 * @private
	 */
	registerPlugins(): void;

	/**
	 * Begin listening for connections
	 */
	listen(): Promise<void>;

	setErrorHandling(handler: ErrorHandlerFn): void;

	handleException(context: RequestContextContract, error: Error | Exception, request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;

	unload(): Promise<void>;
}
