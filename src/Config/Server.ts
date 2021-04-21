import {FastifyPlugin, FastifyPluginOptions, FastifyServerOptions} from "fastify";
import {default as FastifyMultipart, FastifyMultipartOptions} from "fastify-multipart";

export default {

	/**
	 * The port that fastify will listen on
	 */
	port : 3000,

	/**
	 * Server providers are Fastify Plugins that you register to the server when it's booted.
	 */
	fastifyPlugins : [
		[
			FastifyMultipart,
			{} as FastifyMultipartOptions
		]
	] as Array<[FastifyPlugin, FastifyPluginOptions]>,

	/**
	 * Any options to pass to fastify when it boots
	 *
	 */
	fastifyOptions : {} as FastifyServerOptions
}
