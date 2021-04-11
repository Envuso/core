import { ErrorHandlerFn } from "./Server/Server";
export declare class Envuso {
    private _app;
    private _server;
    /**
     * Boot the core App instance, bind any service
     * providers to the container and such.
     */
    prepare(): Promise<void>;
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
