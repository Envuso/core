import {HTTPMethods} from "fastify";
import {DecoratorHelpers, METADATA} from "../../Common";
import {ControllerMethodMetadata} from "../Route/Route";
import {ControllerManager} from "./ControllerManager";

export interface AllControllerMeta {
	controller: ControllerMetadata;
	methods: ControllerMethodMetadata[];
}

export interface ControllerMetadata {
	path: string;
	target: any;
	injectionParams?: any[];
}

export interface HandlerDecorator {
	(target: any, key: string, value: any): void;
}


/**
 * Allows us to use an @controller('/path') decorator
 * to register this as a controller
 *
 * @param path
 */
export function controller(path: string = '') {
	return ControllerManager.bindControllerMeta(path);
}


export function all(path: string): HandlerDecorator {
	return httpMethod(["GET", "DELETE", "HEAD", "POST", "PATCH", "PUT", "OPTIONS"], path);
}

export function get(path: string): HandlerDecorator {
	return httpMethod("GET", path);
}

export function post(path: string): HandlerDecorator {
	return httpMethod("POST", path);
}

export function put(path: string): HandlerDecorator {
	return httpMethod("PUT", path);
}

export function patch(path: string): HandlerDecorator {
	return httpMethod("PATCH", path);
}

export function head(path: string): HandlerDecorator {
	return httpMethod("HEAD", path);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export function destroy(path: string): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export function remove(path: string): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 */
export function delete_(path: string): HandlerDecorator {
	return httpMethod("DELETE", path);
}

/**
 * Specify the HTTP methods you want to use explicitly
 *
 * @param methods
 * @param path
 */
export function method(methods: HTTPMethods | HTTPMethods[], path: string): HandlerDecorator {
	return httpMethod(methods, path);
}

export function httpMethod(method: HTTPMethods | HTTPMethods[], path: string): HandlerDecorator {
	return function (target: any, key: string, value: any) {

		const controllerMethod = target[key];
		const parameterNames   = DecoratorHelpers.getParameterNames(controllerMethod);
		const parameterTypes   = DecoratorHelpers.paramTypes(target, key);

		const parameters = parameterNames.map((name, index) => ({
			name : name,
			type : parameterTypes[index] ?? null
		}));

		const metadata: ControllerMethodMetadata = {
			key,
			method,
			path,
			target,
			parameters
		};

		const metadataList: ControllerMethodMetadata[] = Reflect.getMetadata(METADATA.CONTROLLER_METHODS, target.constructor) || [];

		if (!Reflect.hasMetadata(METADATA.CONTROLLER_METHODS, target.constructor)) {
			Reflect.defineMetadata(METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
		}

		metadataList.push(metadata);

		Reflect.defineMetadata(METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
	};
}
