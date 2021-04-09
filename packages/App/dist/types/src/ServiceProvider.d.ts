import { App } from "./App";
import { ConfigRepository } from "./Config/ConfigRepository";
export declare abstract class ServiceProvider {
    /**
     * Register any services to the container
     */
    abstract register(app: App, config: ConfigRepository): Promise<void>;
    /**
     * Should not be used to bind any services to the container
     * This method will have access to all other services,
     * since it has been called after register()
     */
    abstract boot(app: App, config: ConfigRepository): Promise<void>;
}
