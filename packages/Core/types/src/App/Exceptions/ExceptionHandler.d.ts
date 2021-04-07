/// <reference types="node" />
import { FastifyReply } from "fastify";
export declare class ExceptionHandler {
    static transform(exception: Error, response: FastifyReply): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>;
    private static responseFor;
}
