import {METADATA} from "@envuso/common";
import {AllControllerMeta} from "./ControllerDecorators";

export class Controller {

	/**
	 * Get the metadata for this controller
	 * Tells us the target for Reflect and it's path
	 */
	getMeta(): AllControllerMeta {
		return {
			controller : Reflect.getMetadata(METADATA.CONTROLLER, this.constructor),
			methods    : Reflect.getMetadata(METADATA.CONTROLLER_METHODS, this.constructor)
		}
	}

}
