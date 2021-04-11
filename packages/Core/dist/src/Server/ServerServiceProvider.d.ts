import { App, ConfigRepository, ServiceProvider } from "@envuso/app";
export declare class ServerServiceProvider extends ServiceProvider {
    register(app: App, config: ConfigRepository): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
}
