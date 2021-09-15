import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage} from "http";
import {DependencyContainer} from "tsyringe";
import {App} from "../../AppContainer";
import {Authenticatable} from "../../Authenticatable";
import {METADATA} from "../../Common";
import {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {ResponseContract} from "../../Contracts/Routing/Context/Response/ResponseContract";
import {SessionContract} from "../../Contracts/Session/SessionContract";
import {SocketConnectionContract} from "../../Contracts/Sockets/SocketConnectionContract";
import {CookieJar} from "../../Cookies";
import {InertiaRequestContract} from "../../Packages/Inertia/Contracts/InertiaRequestContract";
import {InertiaRequest} from "../../Packages/Inertia/InertiaRequest";
import {Request} from "./Request/Request";
import {RequestContextStore} from "./RequestContextStore";
import {Response} from "./Response/Response";

export class RequestContext implements RequestContextContract {

	public request: RequestContract = null;

	public response: ResponseContract = null;

	public container: DependencyContainer;

	public user: AuthenticatableContract<any>;

	public session: SessionContract = null;

	public socket: SocketConnectionContract = null;

	public inertia: InertiaRequestContract = null;

	private additional: { [key: string]: any } = {};

	constructor(
		request?: FastifyRequest | IncomingMessage,
		response?: FastifyReply,
		socket?: SocketConnectionContract
	) {
		if (request) {
			this.request = new Request(this, request);

			if (!(request instanceof IncomingMessage))
				this.inertia = new InertiaRequest(this, request);
		}
		if (response)
			this.response = new Response(this, response);
		if (socket)
			this.socket = socket;
	}

	/**
	 * We use async localstorage to help have context around the app without direct
	 * access to our fastify request. We also bind this context class to the fastify request
	 *
	 * @param done
	 */
	public bindToFastify(done) {
		this.container = App.getInstance().container().createChildContainer();

		// We bind the context to the current request, so it's obtainable
		// throughout the lifecycle of this request, this isn't bound to
		// our wrapper request class, only the original fastify request
		const request = this.request.fastifyRequest;
		if (!request) {
			done();

			return;
		}

		Reflect.defineMetadata(
			METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest
		);

		RequestContextStore.getInstance().bind(this.request.fastifyRequest, done);
	}

	public bindToSockets(done) {
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
	static get(): RequestContextContract {
		return RequestContextStore.getInstance().context();
	}

	/**
	 * Return the Fastify Request wrapper
	 */
	static request(): RequestContract {
		return this.get().request;
	}

	/**
	 * Return the Fastify Reply wrapper, this implements our
	 * own helper methods to make things a little easier
	 */
	static response(): ResponseContract {
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
	 * Check if we have a session configured
	 *
	 * @return {boolean}
	 */
	public hasSession() {
		return this.session !== null;
	}

	/**
	 * Return the session instance
	 *
	 * @returns {SessionContract}
	 */
	static session(): SessionContract {
		return this.get().session;
	}

	/**
	 * Set the currently authed user on the context(this will essentially authorise this user)
	 * @param user
	 */
	public setUser<T>(user: AuthenticatableContract<T>) {
		//	const authedUser = new Authenticatable().setUser(user) as Authenticatable<T>;

		this.container.register<AuthenticatableContract<T>>(
			Authenticatable, {useValue : user}
		);

		if (this.hasSession()) {
			this.session.setUser(user);
		}

		this.user = user;
	}

	/**
	 * A session will be initiated via middleware when we receive a request
	 * {@see /Session/Middleware/StartSessionMiddleware.ts}
	 *
	 * @param {SessionContract} session
	 *
	 * @returns {RequestContextContract}
	 */
	public setSession(session: SessionContract): RequestContextContract {
		this.session = session;

		return this;
	}

	/**
	 * Set an additional value on the request context
	 *
	 * @param {string} key
	 * @param value
	 * @return {RequestContextContract}
	 */
	public setAdditional(key: string, value: any): RequestContextContract {
		this.additional[key] = value;

		return this;
	}

	/**
	 * Get an additional value from the request context.
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public getAdditional<T extends any>(key: string, _default: any = null): T {
		return this.additional[key] ?? _default;
	}

}

