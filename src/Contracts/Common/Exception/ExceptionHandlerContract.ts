import {Exception} from "../../../Common";
import {ExceptionResponse} from "../../../Common/Exception/ExceptionHandler";
import {RequestContract} from "../../Routing/Context/Request/RequestContract";
import {RedirectResponseContract} from "../../Routing/Context/Response/RedirectResponseContract";

export interface ExceptionHandlerConstructorContract {
	new();

	handle(request: RequestContract, exception: Exception | Error): ExceptionResponse | RedirectResponseContract;
}

export interface ExceptionHandlerContract {
	renderableExceptions: (new () => Exception)[];
	reportableExceptions: (new () => Exception)[];
	ignoredExceptions: (new () => Exception)[];
	internallyIgnoredExceptions: (new () => Exception)[];

	process(request: RequestContract, exception: Exception): ExceptionResponse | RedirectResponseContract | null;

	handleViewResponse(request: RequestContract, exception: Exception): ExceptionResponse;

	shouldHandle(exception: Exception): boolean;

	isReportable(exception: Exception): boolean;

	isRenderable(exception: Exception): boolean;
}
