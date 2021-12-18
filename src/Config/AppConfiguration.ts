import Environment from "../AppContainer/Config/Environment";
import {ApplicationConfiguration} from "../Contracts/AppContainer/AppContract";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {EncryptionServiceProvider} from "../";
import {DatabaseServiceProvider} from "../";
import {AuthenticationServiceProvider} from "../";
import {RouteServiceProvider} from "../";
import {StorageServiceProvider} from "../";
import {ServerServiceProvider} from "../";
import {EventServiceProvider} from "../";
import {SecurityServiceProvider} from "../";
import {AuthorizationServiceProvider} from "../";
import {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";
import {ExceptionHandlerConstructorContract} from "../Contracts/Common/Exception/ExceptionHandlerContract";
import {InertiaServiceProvider} from "../Packages/Inertia/InertiaServiceProvider";
import {SessionServiceProvider} from "../Session/SessionServiceProvider";
import {ExceptionHandler} from "../Common/Exception/ExceptionHandler";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {QueueServiceProvider} from "../Queue/QueueServiceProvider";
import {WebSocketsServiceProvider} from "../WebSockets/WebSocketsServiceProvider";


export default class AppConfiguration extends ConfigurationCredentials implements ApplicationConfiguration {

	environment: string = Environment.getEnv();

	appKey = Environment.get<string>('APP_KEY', '1234');

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
		//		QueueServiceProvider,
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
		models      : true,

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
