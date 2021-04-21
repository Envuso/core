import { App, ConfigRepository, ServiceProvider } from "../AppContainer";
export declare class DatabaseServiceProvider extends ServiceProvider {
    register(app: App, config: ConfigRepository): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
    loadModels(modulePath: string): Promise<void>;
}
