import Environment from "../AppContainer/Config/Environment";
import type {ApplicationConfiguration} from "../Contracts/AppContainer/AppContract";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {EncryptionServiceProvider} from "../Crypt/EncryptionServiceProvider";
import {DatabaseServiceProvider} from "../Database/DatabaseServiceProvider";
import {AuthenticationServiceProvider} from "../Authentication/AuthenticationServiceProvider";
import {RouteServiceProvider} from "../Routing/RouteServiceProvider";
import {StorageServiceProvider} from "../Storage/StorageServiceProvider";
import {ServerServiceProvider} from "../Server/ServerServiceProvider";
import {EventServiceProvider} from "../Events/EventServiceProvider";
import {SecurityServiceProvider} from "../Security/SecurityServiceProvider";
import {AuthorizationServiceProvider} from "../Authorization/AuthorizationServiceProvider";
import type {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";
import type {ExceptionHandlerConstructorContract} from "../Contracts/Common/Exception/ExceptionHandlerContract";
import {OAuthServiceProvider} from "../OAuthProvider/OAuthServiceProvider";
import {InertiaServiceProvider} from "../Packages/Inertia/InertiaServiceProvider";
import {SessionServiceProvider} from "../Session/SessionServiceProvider";
import {ExceptionHandler} from "../Common/Exception/ExceptionHandler";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {WebSocketsServiceProvider} from "../WebSockets/WebSocketsServiceProvider";


export default class AppConfiguration extends ConfigurationCredentials implements ApplicationConfiguration {

	environment: string = Environment.getEnv();

	// Required, at least 32 characters (the app refuses to boot otherwise)
	appKey = Environment.get<string>('APP_KEY');

	providers: (new () => ServiceProviderContract)[] = [
		SecurityServiceProvider,
		SessionServiceProvider,
		EventServiceProvider,
		DatabaseServiceProvider,
		RedisServiceProvider,
		EncryptionServiceProvider,
		AuthenticationServiceProvider,
		AuthorizationServiceProvider,
		RouteServiceProvider,
		StorageServiceProvider,
		ServerServiceProvider,
		InertiaServiceProvider,
		// QueueServiceProvider,
		OAuthServiceProvider,
		WebSocketsServiceProvider
	];

	exceptionHandler: ExceptionHandlerConstructorContract = ExceptionHandler;

	/**
	 * The base url which will be used for constructing urls everywhere inside the application
	 *
	 * This should be where your application is running, locally or in production and accessible.
	 *
	 * @type {string}
	 */
	url: string = Environment.get('APP_URL', 'http://127.0.0.1:' + Environment.get('PORT', 3000));

	logging = {
		middleware  : false,
		routes      : false,
		controllers : false,
		providers   : true,
		serverHooks : true,
		models      : false,

		socketInformation : true,
		socketChannels    : true,
		socketExceptions  : false,
		databaseQuery     : true,
	};

	isDev() {
		return this.environment === 'development';
	}

	isProd() {
		return this.environment === 'production';
	}

}
