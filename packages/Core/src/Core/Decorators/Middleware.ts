import {Middleware as BaseMiddleware, Middleware} from "../Providers/Http/Controller/Middleware";

export type RouteMiddleware = BaseMiddleware;


export function middleware(middleware: RouteMiddleware): any {
	return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
		const middlewares = [];
		const meta        = Middleware.getMetadata(target);

		if (meta?.middlewares) {
			middlewares.push(...meta.middlewares);
		}

		middlewares.push(middleware);

		let bindTarget = descriptor?.value;

		if (!bindTarget) {
			bindTarget = target;
		}

		Middleware.setMetadata(bindTarget, middlewares);
	}
}
