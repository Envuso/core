import { FastifyReply, FastifyRequest } from "fastify";
export declare abstract class Middleware {
    abstract handler(request: FastifyRequest, response: FastifyReply): Promise<any>;
    static getMetadata(controller: any): any;
    static setMetadata(controller: any, middlewares: Middleware[]): void;
}
