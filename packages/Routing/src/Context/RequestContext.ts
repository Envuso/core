import {DependencyContainer} from "@envuso/app";
import {App} from "@envuso/app/dist/src";
import {Authenticatable, METADATA} from "@envuso/common";
import {FastifyReply, FastifyRequest} from "fastify";
import {Request} from "./Request/Request";
import {RequestContextStore} from "./RequestContextStore";
import {Response} from "./Response/Response";

export class RequestContext {

	request: Request;
	response: Response;
	container: DependencyContainer;
	user: Authenticatable;

	constructor(
		request: FastifyRequest,
		response: FastifyReply
	) {
		this.request  = new Request(request);
		this.response = new Response(response);
	}

	/**
	 * We use async localstorage to help have context around the app without direct
	 * access to our fastify request. We also bind this context class to the fastify request
	 *
	 * @param done
	 */
	bind(done) {
		this.container = App.getInstance().container().createChildContainer();

		// We bind the context to the current request, so it's obtainable
		// throughout the lifecycle of this request, this isn't bound to
		// our wrapper request class, only the original fastify request
		Reflect.defineMetadata(
			METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest
		);

		RequestContextStore.getInstance().bind(this.request.fastifyRequest, done);
	}

	/**
	 * Get the current request context.
	 * This will return an instance of this class.
	 */
	static get(): RequestContext {
		return RequestContextStore.getInstance().context();
	}

	/**
	 * Return the Fastify Request wrapper
	 */
	static request(): Request {
		return this.get().request;
	}

	/**
	 * Return the Fastify Reply wrapper, this implements our
	 * own helper methods to make things a little easier
	 */
	static response(): Response {
		return this.get().response;
	}

	/**
	 * Set the currently authed user on the context(this will essentially authorise this user)
	 * @param user
	 */
	public setUser(user: typeof Authenticatable) {
		const authedUser = new Authenticatable(user);

		this.container.register<Authenticatable>(
			Authenticatable, {useValue : authedUser}
		);

		this.user = authedUser;
	}
}
