import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {FastifyPlugin, FastifyPluginOptions, FastifyServerOptions} from "fastify";
import {FastifyCorsOptions} from "fastify-cors";
import {default as FastifyMultipart, FastifyMultipartOptions} from "fastify-multipart";
import {HandleInertiaRequestMiddleware} from "../App/Http/Middleware/HandleInertiaRequestMiddleware";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {ServerConfiguration as ServerConfig} from "../Contracts/Server/ServerContract";
import {InjectViewGlobals} from "../Routing/Views/InjectViewGlobals";
import {BindRequestContextHook} from "../Server/InternalHooks/BindRequestContextHook";
import {ConvertEmptyStringsToNullHook} from "../Server/InternalHooks/ConvertEmptyStringsToNullHook";
import {InitiateRequestContextHook} from "../Server/InternalHooks/InitiateRequestContextHook";
import {ProcessUploadedFilesHook} from "../Server/InternalHooks/ProcessUploadedFilesHook";
import {SaveSessionHook} from "../Server/InternalHooks/SaveSessionHook";
import {SetResponseCookiesHook} from "../Server/InternalHooks/SetResponseCookiesHook";
import {StartSessionMiddleware} from "../Session/Middleware/StartSessionMiddleware";

export default class ServerConfiguration extends ConfigurationCredentials implements ServerConfig {

	/**
	 * The port that fastify will listen on
	 */
	port = 3000;

	/**
	 * The address that fastify will listen on
	 */
	address = '0.0.0.0';

	/**
	 * Global middleware that will run on every application request
	 */
	middleware = [
		StartSessionMiddleware,
		InjectViewGlobals,
		HandleInertiaRequestMiddleware,
	];

	/**
	 * We have a custom wrapper of fastify's server hooks
	 * This will allow us to extend fastify/framework logic a little
	 *
	 * Be warned, removing some of these may break some core logic handling of the server.
	 *
	 * @type {Array<HookTypes>}
	 */
	hooks = [
		BindRequestContextHook,
		InitiateRequestContextHook,
		ConvertEmptyStringsToNullHook,
		ProcessUploadedFilesHook,
		SetResponseCookiesHook,
		SaveSessionHook,
	];

	/**
	 * Any cookie names that you wish to not encrypt/decrypt
	 */
	disableCookieEncryption = [];

	/**
	 * Cors is automatically configured internally due to some framework
	 * configuration that needs to align. But you can also adjust the
	 * configuration you wish to use here.
	 */
	cors = {
		enabled : true,
		options : {
			origin      : (origin: string, callback) => {
				callback(null, true);
			},
			credentials : true,
		} as FastifyCorsOptions
	};

	/**
	 * Server providers are Fastify Plugins that you register to the server when it's booted.
	 */
	fastifyPlugins: Array<[FastifyPlugin, FastifyPluginOptions]> = [
		[FastifyMultipart, {} as FastifyMultipartOptions],
		[require('fastify-helmet'), {contentSecurityPolicy : false}],
	];

	/**
	 * Any options to pass to fastify when it boots
	 *
	 */
	fastifyOptions: FastifyServerOptions = {};

	/**
	 * Before we return a response we serialize the result, mainly
	 * so that class transformer can do it's work, but also to help
	 * with random errors that occur from circular references.
	 *
	 * excludeExtraneousValues can induce results that you might not
	 * expect but helps prevent internal references used in your code
	 * and the framework from being returned in a response.
	 */
	responseSerialization: ClassTransformOptions = {
		enableCircularCheck : true,
		strategy            : "exposeAll",
		//		excludeExtraneousValues : true,
	};

}
