import { App, ConfigRepository, ServiceProvider } from "../AppContainer";
import { Controller } from "./Controller/Controller";
export declare class RouteServiceProvider extends ServiceProvider {
    register(app: App): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
    /**
     * Get all controllers from the container
     */
    getAllControllers(): Controller[];
}
