import {FastifyReply, FastifyRequest} from "fastify";
import {interfaces} from "inversify";

import {User} from "@App/Models/User";
import Container from "../../../Container";
import {METADATA} from "@Core/DecoratorData";
import {AuthorisedUser} from "@Core/Providers";
import {HttpContextStore} from "@Core/Providers";
import {HttpRequest} from "./HttpRequest";
import {HttpResponse} from "./HttpResponse";

export class HttpContext {

	request: HttpRequest;
	response: HttpResponse;
	container: interfaces.Container;
	user: AuthorisedUser;

	constructor(
		request: FastifyRequest,
		response: FastifyReply
	) {
		this.request  = new HttpRequest(request);
		this.response = new HttpResponse(response);
	}

	/**
	 * We use async localstorage to help have context around the app without direct
	 * access to our fastify request. We also bind this context class to the fastify request
	 *
	 * @param done
	 */
	bind(done) {
		this.container = Container.createChild();

		// We bind the context to the current request, so it's obtainable
		// throughout the lifecycle of this request, this isn't bound to
		// our wrapper request class, only the original fastify request
		Reflect.defineMetadata(
			METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest
		);

		HttpContextStore.getInstance().bind(this.request.fastifyRequest, done);
	}

	/**
	 * Get the current request context.
	 * This will return an instance of this class.
	 */
	static get(): HttpContext {
		return HttpContextStore.getInstance().context();
	}

	/**
	 * Return the Fastify Request wrapper
	 */
	static request(): HttpRequest {
		return this.get().request;
	}

	/**
	 * Return the Fastify Reply wrapper, this implements our
	 * own helper methods to make things a little easier
	 */
	static response(): HttpResponse {
		return this.get().response;
	}

	/**
	 * Set the currently authed user on the context(this will essentially authorise this user)
	 * @param user
	 */
	public setUser(user: User) {
		const authedUser = new AuthorisedUser(user);

		this.container
			.bind<AuthorisedUser>(AuthorisedUser)
			.toConstantValue(authedUser);

		this.user = authedUser;
	}
}
