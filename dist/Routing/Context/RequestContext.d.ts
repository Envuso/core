import { FastifyReply, FastifyRequest } from "fastify";
import { DependencyContainer } from "tsyringe";
import { Authenticatable } from "../../Common";
import { Request } from "./Request/Request";
import { Response } from "./Response/Response";
import { Session } from "./Session";
export declare class RequestContext {
    request: Request;
    response: Response;
    container: DependencyContainer;
    user: Authenticatable<any>;
    session: Session;
    constructor(request: FastifyRequest, response: FastifyReply);
    /**
     * Set any cookies from the request into the cookie jar
     * If we're using cookie based sessions, prepare our session
     */
    initiateForRequest(): Promise<void>;
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
     * The developer may have disabled the session authentication provider
     * In which case, session will be null. We need to make sure we can
     * easily check this before interacting with any session logic
     *
     * @returns {boolean}
     */
    static isUsingSession(): boolean;
    /**
     * Return the session instance
     *
     * @returns {Session}
     */
    static session(): Session;
    /**
     * Set the currently authed user on the context(this will essentially authorise this user)
     * @param user
     */
    setUser<T>(user: Authenticatable<T>): void;
}
