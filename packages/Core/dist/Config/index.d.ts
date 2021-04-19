/// <reference types="node" />
export declare const Config: {
    app: {
        appKey: string;
        providers: (typeof import("@envuso/authentication/dist").AuthenticationServiceProvider | typeof import("@envuso/routing/dist").RouteServiceProvider)[];
    };
    auth: {
        userModel: typeof import("../src/App/Models/User").User;
        authenticationProvider: typeof import("@envuso/authentication/dist").JwtAuthenticationProvider;
        userProvider: typeof import("..").ModelUserProvider;
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
        defaultProvider: typeof import("@envuso/storage/dist").S3Provider;
        s3: import("./Storage").S3Config;
    };
    server: {
        port: number;
        fastifyPlugins: [import("fastify").FastifyPlugin<Record<never, never>>, import("fastify").FastifyPluginOptions][];
        fastifyOptions: import("fastify").FastifyServerOptions<import("http").Server, import("fastify").FastifyLoggerInstance>;
    };
};
