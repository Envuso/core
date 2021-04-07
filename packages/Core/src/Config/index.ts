import {ClassTransformOptions} from "class-transformer";
import {FastifyPlugin, FastifyPluginOptions} from "fastify";
import {SignOptions, VerifyOptions} from "jsonwebtoken";
import {http} from "./http";
import {app} from "./app";
import {auth} from "./auth";
import {database} from "./database";
import {providers, serverProviders} from "./providers";
import {storage} from "./storage";

export interface ConfigInterface {
	app: {
		hostname: string;
		port: string;
		appKey: string
	};

	database: {
		mongo: {
			connectionUrl: string;
		};
		redis: {
			port: number;
			host: string
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
				secretAccessKey: string
			};
			url: string
		};
		defaultProvider: any
	};

	auth: {
		jwtSigningOptions: SignOptions;
		jwtVerifyOptions: VerifyOptions;
		primaryLoginCredential: "email" | "password"
	};

	http: {
		responseSerialization: ClassTransformOptions
	};

}

export const Config: ConfigInterface = {
	app,
	database,
	providers,
	serverProviders,
	storage,
	auth,
	http,
}


