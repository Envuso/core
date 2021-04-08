import { ControllerMetadata } from "../../../Decorators/Controller";
import { ControllerMethodMetadata } from "../../../Decorators/Route";
export declare class Controller {
    getMetadata(): ControllerMetadata;
    getMethodMetadata(): ControllerMethodMetadata[];
}
