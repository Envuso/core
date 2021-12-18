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


export function all(path: string = ''): HandlerDecorator {
	return httpMethod(["GET", "DELETE", "HEAD", "POST", "PATCH", "PUT", "OPTIONS"], path);
}

export function get(path: string = ''): HandlerDecorator {
	return httpMethod("GET", path);
}

export function post(path: string = ''): HandlerDecorator {
	return httpMethod("POST", path);
}

export function put(path: string = ''): HandlerDecorator {
	return httpMethod("PUT", path);
}

export function patch(path: string = ''): HandlerDecorator {
	return httpMethod("PATCH", path);
}

export function head(path: string = ''): HandlerDecorator {
	return httpMethod("HEAD", path);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export function destroy(path: string = ''): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export function remove(path: string = ''): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 */
export function delete_(path: string = ''): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * Specify the HTTP methods you want to use explicitly
 *
 * @param methods
 * @param path
 */
export function method(methods: HTTPMethods | HTTPMethods[], path: string = ''): HandlerDecorator {
	return httpMethod(methods, path);
}


