import { App, ServiceProvider } from "@envuso/app";
export declare class CacheServiceProvider extends ServiceProvider {
    register(app: App, config: any): Promise<void>;
    boot(): Promise<void>;
}
