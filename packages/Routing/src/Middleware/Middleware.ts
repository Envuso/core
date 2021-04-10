import {METADATA} from "@envuso/common";
import {FastifyReply, FastifyRequest} from "fastify";

export abstract class Middleware {

	public abstract handler(request: FastifyRequest, response: FastifyReply): Promise<any>;

	static getMetadata(controller: any) {
		return Reflect.getMetadata(METADATA.MIDDLEWARE, controller);
	}

	static setMetadata(controller: any, middlewares: Middleware[]) {
		return Reflect.defineMetadata(METADATA.MIDDLEWARE, {middlewares}, controller);
	}

}
