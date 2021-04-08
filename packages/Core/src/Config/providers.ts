import {FastifyPlugin, FastifyPluginOptions} from "fastify";

import {default as FastifyMultipart, FastifyMultipartOptions} from "fastify-multipart";
import {
	AuthServiceProvider,
	CacheServiceProvider,
	ControllerServiceProvider,
	EncryptionServiceProvider,
	LogServiceProvider,
	ModelServiceProvider,
	ServerServiceProvider,
	StorageServiceProvider
} from "@Core";

/**
 * These are our service providers, they are the
 * core functionality of the framework.
 *
 * You can remove a provider and replace it with your
 * own, or completely disable some functionality.
 */
export const providers = [

	EncryptionServiceProvider,
	LogServiceProvider,
	CacheServiceProvider,
	StorageServiceProvider,
	ModelServiceProvider,
	AuthServiceProvider,
	ControllerServiceProvider,
	ServerServiceProvider,

];

/**
 * Server providers are Fastify Plugins that you register to the server when it's booted.
 */
export const serverProviders: Array<[FastifyPlugin, FastifyPluginOptions]> = [
	[
		FastifyMultipart,
		{} as FastifyMultipartOptions
	]
]
