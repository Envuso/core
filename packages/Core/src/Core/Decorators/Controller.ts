import {decorate, injectable} from "inversify";
import {METADATA} from "../DecoratorData";

export interface ControllerMetadata {
	path: string;
	target: any;
}

//export const currentUser      = lazyInject(AUTHED_USER_IDENTIFIER);
//export const currentRequest   = lazyInject(HTTP_REQUEST_IDENTIFIER);
//export const requestContainer = inject(CONTAINER_IDENTIFIER);

export function controller(path: string = '') {
	return function (target: any) {

		const currentMetadata: ControllerMetadata = {
			path   : path,
			target : target
		};

		decorate(injectable(), target);
		Reflect.defineMetadata(METADATA.CONTROLLER, currentMetadata, target);

		// We need to create an array that contains the metadata of all
		// the controllers in the application, the metadata cannot be
		// attached to a controller. It needs to be attached to a global
		// We attach metadata to the Reflect object itself to avoid
		// declaring additional globals. Also, the Reflect is available
		// in both node and web browsers.
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


