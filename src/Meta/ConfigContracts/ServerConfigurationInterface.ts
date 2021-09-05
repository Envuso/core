import { ClassTransformOptions } from "class-transformer";
import { FastifyPlugin, FastifyPluginOptions, FastifyServerOptions } from "fastify";
import { FastifyCorsOptions } from "fastify-cors";
import { StartSessionMiddleware } from "../../Session/Middleware/StartSessionMiddleware";

export interface ServerConfigurationInterface {
    /**
     * The port that fastify will listen on
     */
    port: number;
    /**
     * Global middleware that will run on every application request
     */
    middleware: (typeof StartSessionMiddleware)[];
    /**
     * Any cookie names that you wish to not encrypt/decrypt
     */
    disableCookieEncryption: any[];
    /**
     * Cors is automatically configured internally due to some framework
     * configuration that needs to align. But you can also adjust the
     * configuration you wish to use here.
     */
    cors: { enabled: boolean; options: FastifyCorsOptions; };
    /**
     * Server providers are Fastify Plugins that you register to the server when it's booted.
     */
    fastifyPlugins: [FastifyPlugin<Record<never, never>>, FastifyPluginOptions][];
    /**
     * Any options to pass to fastify when it boots
     *
     */
    fastifyOptions: FastifyServerOptions<import("http").Server, import("/Users/sam/Code/EnvusoProjects/Core/node_modules/fastify/fastify").FastifyLoggerInstance>;
    /**
     * Before we return a response we serialize the result, mainly
     * so that class transformer can do it's work, but also to help
     * with random errors that occur from circular references.
     *
     * excludeExtraneousValues can induce results that you might not
     * expect but helps prevent internal references used in your code
     * and the framework from being returned in a response.
     */
    responseSerialization: ClassTransformOptions;
}
