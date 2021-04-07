import { ServiceProvider } from "@Providers/ServiceProvider";
import { FastifyInstance } from "fastify";
import { Server } from "./Server";
export declare class ServerServiceProvider extends ServiceProvider {
    /**
     * The Fastify Server wrapped with our own logic
     * @public
     */
    server: Server;
    /**
     * The instance of Fastify that {@see Server} is using	 *
     * @public
     */
    httpServer: FastifyInstance;
    registerBindings(): void;
    boot(): Promise<void>;
    run(): Promise<void>;
}
