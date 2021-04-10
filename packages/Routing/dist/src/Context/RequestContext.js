"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const src_1 = require("@envuso/app/dist/src");
const common_1 = require("@envuso/common");
const Request_1 = require("./Request/Request");
const RequestContextStore_1 = require("./RequestContextStore");
const Response_1 = require("./Response/Response");
class RequestContext {
    constructor(request, response) {
        this.request = new Request_1.Request(request);
        this.response = new Response_1.Response(response);
    }
    /**
     * We use async localstorage to help have context around the app without direct
     * access to our fastify request. We also bind this context class to the fastify request
     *
     * @param done
     */
    bind(done) {
        this.container = src_1.App.getInstance().container().createChildContainer();
        // We bind the context to the current request, so it's obtainable
        // throughout the lifecycle of this request, this isn't bound to
        // our wrapper request class, only the original fastify request
        Reflect.defineMetadata(common_1.METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest);
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
     * Set the currently authed user on the context(this will essentially authorise this user)
     * @param user
     */
    setUser(user) {
        const authedUser = new common_1.Authenticatable(user);
        this.container.register(common_1.Authenticatable, { useValue: authedUser });
        this.user = authedUser;
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=RequestContext.js.map