/// <reference types="node" />
import { StorageServiceProvider } from "../Storage";
export declare const Config: {
    app: {
        appKey: string;
        providers: (typeof StorageServiceProvider)[];
    };
    auth: {
        authenticationProvider: typeof import("../Authentication").JwtAuthenticationProvider;
        userProvider: typeof import("../Authentication").BaseUserProvider;
        primaryIdentifier: keyof import("./Auth").AuthCredentialContract;
        jwt: {
            authorizationHeaderPrefix: string;
            jwtSigningOptions: import("jsonwebtoken").SignOptions;
            jwtVerifyOptions: import("jsonwebtoken").VerifyOptions;
        };
    };
    database: {
        mongo: import("./Database").MongoConnectionConfiguration;
        redis: import("./Database").RedisDatabaseConfiguration;
    };
    storage: {
        defaultProvider: typeof import("../Storage").S3Provider;
        s3: import("./Storage").S3Config;
    };
    server: {
        port: number;
        fastifyPlugins: [import("fastify").FastifyPlugin<Record<never, never>>, import("fastify").FastifyPluginOptions][];
        fastifyOptions: import("fastify").FastifyServerOptions<import("http").Server, import("fastify").FastifyLoggerInstance>;
    };
};
