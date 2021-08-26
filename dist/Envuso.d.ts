import { ErrorHandlerFn } from "./Server/Server";
export declare class Envuso {
    private _app;
    private _server;
    /**
     * Boot the core App instance, bind any service
     * providers to the container and such.
     */
    prepare(config: object): Promise<void>;
    /**
     * There is certain cases where we need to boot the framework, but not run the web server
     * Instead of calling prepare(), we can call this method
     *
     * @param {object} config
     * @returns {Promise<void>}
     */
    initiateWithoutServing(config: object): Promise<void>;
    /**
     * Load a custom exception handler for handling errors from requests
     * and returning a formatted response to your liking.
     *
     * @param handler
     */
    addExceptionHandler(handler: ErrorHandlerFn): void;
    /**
     * This will initialise all of the server
     * Bind your custom exception handler and begin listening for connections.
     */
    serve(): Promise<void>;
}
