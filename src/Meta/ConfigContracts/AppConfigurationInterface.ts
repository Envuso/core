import { ServiceProviderContract } from "../../Contracts/AppContainer/ServiceProviderContract";
import { ExceptionHandlerConstructorContract } from "../../Contracts/Common/Exception/ExceptionHandlerContract";

export interface AppConfigurationInterface {
    environment: string;
    appKey: string;
    providers: (new () => ServiceProviderContract)[];
    exceptionHandler: ExceptionHandlerConstructorContract;
    isDev(): boolean;
    isProd(): boolean;
}
