import { ServiceProvider } from "../ServiceProvider";
export interface ModelServiceProviderCachedModel {
    name: string;
    location: string;
    import: string;
    originalLocation: string;
}
export declare class ModelServiceProvider extends ServiceProvider {
    private models;
    registerBindings(): Promise<void>;
    boot(): Promise<void>;
    getModels(): ModelServiceProviderCachedModel[];
    private setupDatabase;
    private setupEntityRepositories;
    private loadModel;
    modelExists(name: string): ModelServiceProviderCachedModel;
}
