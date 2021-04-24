"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const AppContainer_1 = require("../../AppContainer");
const Authentication_1 = require("../../Authentication");
const Common_1 = require("../../Common");
const Request_1 = require("./Request/Request");
const RequestContextStore_1 = require("./RequestContextStore");
const Response_1 = require("./Response/Response");
const Session_1 = require("./Session");
class RequestContext {
    constructor(request, response) {
        this.session = null;
        this.request = new Request_1.Request(request);
        this.response = new Response_1.Response(response);
    }
    /**
     * Set any cookies from the request into the cookie jar
     * If we're using cookie based sessions, prepare our session
     */
    initiateForRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response.cookieJar().setCookies(this.request.fastifyRequest);
            if (AppContainer_1.resolve(Authentication_1.Authentication).isUsingProvider(Authentication_1.SessionAuthenticationProvider)) {
                this.session = yield Session_1.Session.prepare(this.response.cookieJar());
            }
        });
    }
    /**
     * We use async localstorage to help have context around the app without direct
     * access to our fastify request. We also bind this context class to the fastify request
     *
     * @param done
     */
    bind(done) {
        this.container = AppContainer_1.App.getInstance().container().createChildContainer();
        // We bind the context to the current request, so it's obtainable
        // throughout the lifecycle of this request, this isn't bound to
        // our wrapper request class, only the original fastify request
        Reflect.defineMetadata(Common_1.METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest);
        RequestContextStore_1.RequestContextStore.getInstance().bind(this.request.fastifyRequest, done);
    }
    /**
     * Get the current request context.
     * This will return an instance of this class.
     */
    static get() {
        return RequestContextStore_1.RequestContextStore.getInstance().context();
    }
    /**
     * Return the Fastify Request wrapper
     */
    static request() {
        return this.get().request;
    }
    /**
     * Return the Fastify Reply wrapper, this implements our
     * own helper methods to make things a little easier
     */
    static response() {
        return this.get().response;
    }
    /**
     * The developer may have disabled the session authentication provider
     * In which case, session will be null. We need to make sure we can
     * easily check this before interacting with any session logic
     *
     * @returns {boolean}
     */
    static isUsingSession() {
        return this.get().session !== null;
    }
    /**
     * Return the session instance
     *
     * @returns {Session}
     */
    static session() {
        return this.get().session;
    }
    /**
     * Set the currently authed user on the context(this will essentially authorise this user)
     * @param user
     */
    setUser(user) {
        const authedUser = new Common_1.Authenticatable().setUser(user);
        this.container.register(Common_1.Authenticatable, { useValue: authedUser });
        this.user = authedUser;
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=RequestContext.js.map