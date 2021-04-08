import { FastifyPlugin, FastifyPluginOptions } from "fastify";
import { EncryptionServiceProvider } from "Core";
/**
 * These are our service providers, they are the
 * core functionality of the framework.
 *
 * You can remove a provider and replace it with your
 * own, or completely disable some functionality.
 */
export declare const providers: (typeof EncryptionServiceProvider)[];
/**
 * Server providers are Fastify Plugins that you register to the server when it's booted.
 */
export declare const serverProviders: Array<[FastifyPlugin, FastifyPluginOptions]>;
