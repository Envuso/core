import { ServiceProvider } from "../AppContainer";
import { App, ConfigRepository } from "../AppContainer";
export declare class AuthorizationServiceProvider extends ServiceProvider {
    register(app: App, config: ConfigRepository): Promise<void>;
    boot(app: App, config: ConfigRepository): Promise<void>;
}
