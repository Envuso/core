import {HTTPMethods} from "fastify";
import {injectable} from "tsyringe";
import {DecoratorHelpers, METADATA} from "../../Common";
import {ControllerMethodMetadata} from "../Route/Route";


export interface HandlerDecorator {
	(target: any, key: string, value: any): void;
}
export interface AllControllerMeta {
	controller: ControllerMetadata;
	methods: ControllerMethodMetadata[];
}

export interface ControllerMetadata {
	path: string;
	target: any;
	injectionParams?: any[];
}

/**
 * Store the metadata for this controller instance on Reflect
 * so we can access the path registered for it, anywhere.
 *
 * @param path
 */
export function bindControllerMeta(path: string) {
	return function (target: any) {

		const currentMetadata: ControllerMetadata = {
			path            : path.isEmpty() ? '/' : path,
			target          : target,
			injectionParams : DecoratorHelpers.paramTypes(target) ?? [],
		};

		injectable()(target);

		//const params = DecoratorHelpers.paramTypes(target);
		Reflect.defineMetadata(METADATA.CONTROLLER, currentMetadata, target);

		const previousMetadata: ControllerMetadata[] = Reflect.getMetadata(
			METADATA.CONTROLLER,
			Reflect
		) || [];

		const newMetadata = [currentMetadata, ...previousMetadata];

		Reflect.defineMetadata(
			METADATA.CONTROLLER,
			newMetadata,
			Reflect
		);
	};
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
