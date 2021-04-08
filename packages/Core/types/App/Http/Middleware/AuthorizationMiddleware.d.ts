import { FastifyReply, FastifyRequest } from "fastify";
import { Middleware } from "Core";
export declare class AuthorizationMiddleware extends Middleware {
    handler(request: FastifyRequest, response: FastifyReply): Promise<void>;
}
