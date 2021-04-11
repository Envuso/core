import { App, ConfigRepository, ServiceProvider } from "@envuso/app";
export declare class DatabaseServiceProvider extends ServiceProvider {
    register(app: App, config: ConfigRepository): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
    loadModels(modulePath: string): Promise<void>;
}
