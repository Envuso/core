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
		QueueServiceProvider,
	];

	exceptionHandler: ExceptionHandlerConstructorContract = ExceptionHandler;

	logging = {
		middleware: true,
		routes: true,
		controllers: true,
		providers: true,
		serverHooks: true,
		socketChannels: true,
	};

	isDev() {
		return this.environment === 'development';
	}

	isProd() {
		return this.environment === 'production';
	}

}
