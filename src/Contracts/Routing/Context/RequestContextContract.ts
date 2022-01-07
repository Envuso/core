import {DependencyContainer} from "tsyringe";
import {InertiaRequestContract} from "../../../Packages/Inertia/Contracts/InertiaRequestContract";
import {AuthenticatableContract} from "../../Authentication/UserProvider/AuthenticatableContract";
import {SessionContract} from "../../Session/SessionContract";
import {WebSocketConnectionContract} from "../../WebSockets/WebSocketConnectionContract";
import {RouteContract} from "../Route/RouteContract";
import {RequestContract} from "./Request/RequestContract";
import {ResponseContract} from "./Response/ResponseContract";

export interface RequestContextContract {
	request: RequestContract;
	response: ResponseContract;
	container: DependencyContainer;
	user: AuthenticatableContract<any>;
	session: SessionContract;
	socket: WebSocketConnectionContract<any>;
	inertia: InertiaRequestContract;

	/**
	 * We use async localstorage to help have context around the app without direct
	 * access to our fastify request. We also bind this context class to the fastify request
	 *
	 * @param done
	 */
	bindToFastify(done): void;

	bindToSockets(connection: WebSocketConnectionContract<any>, done): void;

	hasSession(): boolean;

	/**
	 * Set the currently authed user on the context(this will essentially authorise this user)
	 * @param user
	 */
	setUser<T>(user: AuthenticatableContract<T>): void;

	/**
	 * A session will be initiated via middleware when we receive a request
	 * {@see /Session/Middleware/StartSessionMiddleware.ts}
	 *
	 * @param {SessionContract} session
	 *
	 * @returns {RequestContextContract}
	 */
	setSession(session: SessionContract): RequestContextContract;

	/**
	 * Set an additional value on the request context
	 *
	 * @param {string} key
	 * @param value
	 * @return {RequestContextContract}
	 */
	setAdditional(key: string, value: any): RequestContextContract;

	/**
	 * Get an additional value from the request context.
	 *
	 * @template T
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	getAdditional<T extends any>(key: string, _default?: any): T;

	/**
	 * Set the currently active route
	 *
	 * @internal
	 * @param {RouteContract} route
	 */
	setCurrentRoute(route: RouteContract): void;

	/**
	 * Get the currently active route
	 *
	 * @returns {RouteContract}
	 */
	route(): RouteContract;
}
