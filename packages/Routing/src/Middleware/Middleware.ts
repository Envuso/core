import {METADATA} from "@envuso/common";
import {RequestContext} from "../Context/RequestContext";

export abstract class Middleware {

	public abstract handler(context: RequestContext): Promise<any>;

	static getMetadata(controller: any) {
		return Reflect.getMetadata(METADATA.MIDDLEWARE, controller);
	}

	static setMetadata(controller: any, middlewares: Middleware[]) {
		return Reflect.defineMetadata(METADATA.MIDDLEWARE, {middlewares}, controller);
	}

}
