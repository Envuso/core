import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage} from "http";
import {DependencyContainer} from "tsyringe";
import {App, resolve} from "../../AppContainer";
import {Authentication, SessionAuthenticationProvider} from "../../Authentication";
import {Authenticatable, METADATA} from "../../Common";
import {SocketConnection} from "../../Sockets/SocketConnection";
import {Request} from "./Request/Request";
import {RequestContextStore} from "./RequestContextStore";
import {Response} from "./Response/Response";
import {Session} from "./Session";

export class RequestContext {

	request: Request   = null;
	response: Response = null;

	container: DependencyContainer;

	user: Authenticatable<any>;

	session: Session = null;

	socket: SocketConnection = null;

	constructor(
		request?: FastifyRequest | IncomingMessage,
		response?: FastifyReply,
		socket?: SocketConnection
	) {
		if (request)
			this.request = new Request(request);
		if (response)
			this.response = new Response(response);
		if (socket)
			this.socket = socket;
	}

	/**
	 * Set any cookies from the request into the cookie jar
	 * If we're using cookie based sessions, prepare our session
	 */
	async initiateForRequest() {
		this.response.cookieJar().setCookies(this.request.fastifyRequest);
		if (resolve(Authentication).isUsingProvider(SessionAuthenticationProvider)) {
			this.session = await Session.prepare(this.response.cookieJar());
		}
	}

	/**
	 * We use async localstorage to help have context around the app without direct
	 * access to our fastify request. We also bind this context class to the fastify request
	 *
	 * @param done
	 */
	bindToFastify(done) {
		this.container = App.getInstance().container().createChildContainer();

		// We bind the context to the current request, so it's obtainable
		// throughout the lifecycle of this request, this isn't bound to
		// our wrapper request class, only the original fastify request
		const request = this.request.fastifyRequest;
		if(!request){
			done();

			return;
		}

		Reflect.defineMetadata(
			METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest
		);

		RequestContextStore.getInstance().bind(this.request.fastifyRequest, done);
	}

	bindToSockets(done) {
		this.container = App.getInstance().container().createChildContainer();

		// We bind the context to the current request, so it's obtainable
		// throughout the lifecycle of this request, this isn't bound to
		// our wrapper request class, only the original fastify request
		Reflect.defineMetadata(
			METADATA.HTTP_CONTEXT, this, this.socket
		);

		RequestContextStore.getInstance().bind(this.socket, done);
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
		return this.get()?.response;
	}

	/**
	 * The developer may have disabled the session authentication provider
	 * In which case, session will be null. We need to make sure we can
	 * easily check this before interacting with any session logic
	 *
	 * @returns {boolean}
	 */
	static isUsingSession(): boolean {
		return this.get().session !== null;
	}

	/**
	 * Return the session instance
	 *
	 * @returns {Session}
	 */
	static session(): Session {
		return this.get().session;
	}

	/**
	 * Set the currently authed user on the context(this will essentially authorise this user)
	 * @param user
	 */
	public setUser<T>(user: Authenticatable<T>) {
		//	const authedUser = new Authenticatable().setUser(user) as Authenticatable<T>;

		this.container.register<Authenticatable<T>>(
			Authenticatable, {useValue : user}
		);

		this.user = user;
	}
}
