export declare abstract class ServiceProvider {
    /**
     * Register any bindings to the ioc container
     * When the framework is loading up, we will load all providers
     * then call this method, after that, we'll call boot on all providers.
     */
    abstract registerBindings(): any;
    /**
     * When the framework is booting, registerBindings() is called, then booted().
     */
    abstract boot(): any;
}
