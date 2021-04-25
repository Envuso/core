/// <reference types="node" />
import { StorageServiceProvider } from '../';
export declare const Config: {
    app: {
        appKey: string;
        providers: (typeof StorageServiceProvider)[];
    };
    auth: {
        authenticationProviders: (typeof import("../Authentication").JwtAuthenticationProvider | typeof import("../Authentication").SessionAuthenticationProvider)[];
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
        redis: import("redis").ClientOpts;
    };
    storage: {
        defaultProvider: typeof import("../Storage").S3Provider;
        s3: import("./Storage").S3Config;
    };
    server: {
        port: number;
        cors: {
            enabled: boolean;
            options: import("fastify-cors").FastifyCorsOptions;
        };
        fastifyPlugins: [import("fastify").FastifyPlugin<Record<never, never>>, import("fastify").FastifyPluginOptions][];
        fastifyOptions: import("fastify").FastifyServerOptions<import("http").Server, import("fastify").FastifyLoggerInstance>;
        responseSerialization: import("class-transformer").ClassTransformOptions;
    };
    session: {
        cookie: import("../Routing").CookieConfiguration;
        cookieName: string;
        encryptCookies: boolean;
    };
};
