import {injectable} from "inversify";
import {METADATA} from "../../../DecoratorData";
import {ControllerMetadata} from "../../../Decorators/Controller";
import {ControllerMethodMetadata} from "../../../Decorators/Route";


@injectable()
export class Controller {

//	@currentRequest
//	protected readonly request: FastifyRequest;
//	@currentUser
//	protected readonly user: AuthorisedUser;
//	@requestContainer
//	protected readonly container: Container;

	getMetadata(): ControllerMetadata {
		return Reflect.getMetadata(METADATA.CONTROLLER, this.constructor);
	}

	getMethodMetadata(): ControllerMethodMetadata[] {
		return Reflect.getMetadata(METADATA.CONTROLLER_METHODS, this.constructor);
	}

}
