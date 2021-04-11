import { App, ServiceProvider } from "@envuso/app";
export declare class EncryptionServiceProvider extends ServiceProvider {
    register(app: App, config: any): Promise<void>;
    boot(): Promise<void>;
}
