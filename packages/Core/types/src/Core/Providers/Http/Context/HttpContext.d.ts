import { AuthorisedUser } from "@Providers/Auth";
import { HttpRequest } from "@Providers/Http";
import { HttpResponse } from "@Providers/Http/Context/Response/HttpResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import { interfaces } from "inversify";
import { User } from "@App/Models/User";
export declare class HttpContext {
    request: HttpRequest;
    response: HttpResponse;
    container: interfaces.Container;
    user: AuthorisedUser;
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
    static get(): HttpContext;
    /**
     * Return the Fastify Request wrapper
     */
    static request(): HttpRequest;
    /**
     * Return the Fastify Reply wrapper, this implements our
     * own helper methods to make things a little easier
     */
    static response(): HttpResponse;
    /**
     * Set the currently authed user on the context(this will essentially authorise this user)
     * @param user
     */
    setUser(user: User): void;
}
