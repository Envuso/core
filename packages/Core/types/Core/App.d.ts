export declare class App {
    /**
     * The Fastify Server wrapped with our own logic
     * @private
     */
    private _server;
    /**
     * The instance of Fastify that {@see Server} is using
     *
     * @private
     */
    private _httpServer;
    registerProviders(): void;
    /**
     * Lets get all the aidss
     *
     * @category Aids
     */
    registerProviderBindings(): Promise<void>;
    /**
     * Load all service providers and initialise the Http Server
     */
    boot(): Promise<void>;
    /**
     * Iterate through all providers in the {@see Config.providers}
     * config file and call boot() on them
     */
    bootProviders(): Promise<void>;
    up(): Promise<void>;
    down(): void;
}
