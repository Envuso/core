import { App } from "../AppContainer/App";
import { ConfigRepository } from "../AppContainer/Config/ConfigRepository";
import { ServiceProvider } from "../AppContainer/ServiceProvider";
export declare class StorageServiceProvider extends ServiceProvider {
    register(app: App, config: ConfigRepository): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
}
