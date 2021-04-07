import { ClassTransformOptions } from "class-transformer";
import { FastifyPlugin, FastifyPluginOptions } from "fastify";
import { SignOptions, VerifyOptions } from "jsonwebtoken";
export interface ConfigInterface {
    app: {
        hostname: string;
        port: string;
        appKey: string;
    };
    database: {
        mongo: {
            connectionUrl: string;
        };
        redis: {
            port: number;
            host: string;
        };
    };
    providers: any[];
    serverProviders: Array<[FastifyPlugin, FastifyPluginOptions]>;
    storage: {
        spaces: {
            bucket: string;
            endpoint: string;
            credentials: {
                accessKeyId: string;
                secretAccessKey: string;
            };
            url: string;
        };
        defaultProvider: any;
    };
    auth: {
        jwtSigningOptions: SignOptions;
        jwtVerifyOptions: VerifyOptions;
        primaryLoginCredential: "email" | "password";
    };
    http: {
        responseSerialization: ClassTransformOptions;
    };
}
export declare const Config: ConfigInterface;
