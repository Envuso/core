import { ServiceProvider } from "@Core/Providers/ServiceProvider";
export declare class StorageServiceProvider extends ServiceProvider {
    registerBindings(): Promise<void>;
    boot(): Promise<void>;
}
