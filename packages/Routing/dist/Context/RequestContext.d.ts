import { DependencyContainer } from "@envuso/app";
import { Authenticatable } from "@envuso/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Request } from "./Request/Request";
import { Response } from "./Response/Response";
export declare class RequestContext {
    request: Request;
    response: Response;
    container: DependencyContainer;
    user: Authenticatable;
    constructor(request: FastifyRequest, response: FastifyReply);
    /**
     * We use async localstorage to help have context around the app without direct
     * access to our fastify request. We also bind this context class to the fastify request
     *
     * @param done
     */
    bind(done: any): void;
    /**
     * Get the current request context.
     * This will return an instance of this class.
     */
    static get(): RequestContext;
    /**
     * Return the Fastify Request wrapper
     */
    static request(): Request;
    /**
     * Return the Fastify Reply wrapper, this implements our
     * own helper methods to make things a little easier
     */
    static response(): Response;
    /**
     * Set the currently authed user on the context(this will essentially authorise this user)
     * @param user
     */
    setUser(user: typeof Authenticatable): void;
}
