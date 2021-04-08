import { ServiceProvider } from "@Core";
export declare class StorageServiceProvider extends ServiceProvider {
    registerBindings(): Promise<void>;
    boot(): Promise<void>;
}
