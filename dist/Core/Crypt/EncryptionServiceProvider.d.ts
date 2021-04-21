import { App, ServiceProvider } from "../../AppContainer";
export declare class EncryptionServiceProvider extends ServiceProvider {
    register(app: App, config: any): Promise<void>;
    boot(): Promise<void>;
}
