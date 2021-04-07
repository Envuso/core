import { FastifyReply, FastifyRequest } from "fastify";
import { Middleware } from "@Providers/Http/Controller/Middleware";
export declare class AuthorizationMiddleware extends Middleware {
    handler(request: FastifyRequest, response: FastifyReply): Promise<void>;
}
