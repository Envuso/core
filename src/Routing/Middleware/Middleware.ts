import {METADATA} from "../../Common/Decorators/RoutingMetaData";
import type {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import type {MiddlewareContract} from "../../Contracts/Routing/Middleware/MiddlewareContract";

export abstract class Middleware implements MiddlewareContract {

	public abstract handle(context: RequestContextContract): Promise<any>;

	public after(context: RequestContextContract): Promise<any> {
		return Promise.resolve(true);
	}

	static getMetadata(controller: any) {
		return Reflect.getMetadata(METADATA.MIDDLEWARE, controller);
	}

	static setMetadata(controller: any, middlewares: Middleware[]) {
		return Reflect.defineMetadata(METADATA.MIDDLEWARE, {middlewares}, controller);
	}

}
