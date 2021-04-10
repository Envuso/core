import { AllControllerMeta } from "./ControllerDecorators";
export declare class Controller {
    /**
     * Get the metadata for this controller
     * Tells us the target for Reflect and it's path
     */
    getMeta(): AllControllerMeta;
}
