import {HTTPMethods} from "fastify";
import {bindControllerMeta, HandlerDecorator, httpMethod} from "./ControllerDecoratorBinding";

/**
 * Allows us to use an @controller('/path') decorator
 * to register this as a controller
 *
 * @param path
 */
export function controller(path: string = '') {
	return bindControllerMeta(path);
}

export function all(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod(["GET", "DELETE", "HEAD", "POST", "PATCH", "PUT", "OPTIONS"], path, fastifyRouteConfig);
}

export function get(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("GET", path, fastifyRouteConfig);
}

export function post(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("POST", path, fastifyRouteConfig);
}

export function put(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("PUT", path, fastifyRouteConfig);
}

export function patch(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("PATCH", path, fastifyRouteConfig);
}

export function head(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("HEAD", path, fastifyRouteConfig);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 * @param fastifyRouteConfig
 */
export function destroy(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("DELETE", path, fastifyRouteConfig);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 * @param fastifyRouteConfig
 */
export function remove(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("DELETE", path, fastifyRouteConfig);
}

/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 * @param fastifyRouteConfig
 */
export function delete_(path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod("DELETE", path, fastifyRouteConfig);
}

/**
 * Specify the HTTP methods you want to use explicitly
 *
 * @param methods
 * @param path
 * @param fastifyRouteConfig
 */
export function method(methods: HTTPMethods | HTTPMethods[], path: string = '', fastifyRouteConfig: any = {}): HandlerDecorator {
	return httpMethod(methods, path, fastifyRouteConfig);
}


