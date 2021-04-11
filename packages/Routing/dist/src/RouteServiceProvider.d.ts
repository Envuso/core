import { App, ConfigRepository, ServiceProvider } from "@envuso/app";
import { Controller } from "./Controller/Controller";
export declare class RouteServiceProvider extends ServiceProvider {
    register(app: App): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
    /**
     * Bind a controller to the container so it's initiated
     * and ready to accept a request when ever one comes in.
     *
     * @param app
     * @param controllerPath
     */
    bindController(app: App, controllerPath: string): Promise<void>;
    /**
     * Get all controllers from the container
     */
    getAllControllers(): Controller[];
}
