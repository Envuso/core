import Environment from "../../AppContainer/Config/Environment";
import {ExceptionHandlerContract} from "../../Contracts/Common/Exception/ExceptionHandlerContract";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {getReasonPhrase, StatusCodes} from "../Http";
import {Arr} from "../Utility/Arr";
import {Exception} from "./Exception";

export type ExceptionResponse = {
	code: StatusCodes;
	message: string;
	data: object | null;
}

export class ExceptionHandler implements ExceptionHandlerContract {

	/**
	 * Errors that are able to be returned as a response
	 *
	 * @type {{new(): Exception}[]}
	 * @protected
	 */
	public renderableExceptions: (new () => Exception)[] = [];

	/**
	 * Errors that are able to be logged
	 *
	 * @type {{new(): Exception}[]}
	 * @protected
	 */
	public reportableExceptions: (new () => Exception)[] = [];

	/**
	 * Exceptions defined by the user that should be ignored
	 *
	 * @type {{new(): Exception}[]}
	 * @protected
	 */
	public ignoredExceptions: (new () => Exception)[] = [];

	/**
	 * Exceptions thrown by the framework that should be ignored
	 *
	 * @type {{new(): Exception}[]}
	 * @protected
	 */
	public internallyIgnoredExceptions: (new () => Exception)[] = [];

	public exceptionMapper: { [key: string]: (error: Error) => ExceptionResponse } = {
		'JsonWebTokenError' : this.handleUnauthorised,
		'TokenExpiredError' : this.handleUnauthorised,
	};

	public static handle(request: RequestContract, exception: Exception | Error): ExceptionResponse {
		const isDev            = Environment.isDev();

		const exceptionHandler = new ExceptionHandler();

		if (!(exception instanceof Exception)) {
			const mapper = exceptionHandler.exceptionMapper[exception.constructor.name];

			if (mapper) {
				const mapperHandler = mapper.bind(exceptionHandler);

				return mapperHandler(exception);
			}

			return {
				code    : StatusCodes.INTERNAL_SERVER_ERROR,
				message : isDev ? exception.toString() : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				data    : {}
			};
		}


		return exceptionHandler.process(request, exception);
	}

	public process(request: RequestContract, exception: Exception): ExceptionResponse | null {
		const isDev = Environment.isDev();

		if (!this.shouldHandle(exception)) {
			return {
				code    : StatusCodes.INTERNAL_SERVER_ERROR,
				message : isDev ? exception.toString() : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				data    : {}
			};
		}

		if (this.isReportable(exception)) {
			exception.handleLoggerResponse();
		}

		if (request.wantsJson()) {
			return {
				code    : exception.code,
				message : exception.message ?? getReasonPhrase(exception.code),
				data    : exception.handleJsonResponse() ?? null,
			};
		}

		if (request.wantsHtml()) {
			return this.handleViewResponse(request, exception);
		}

		return {
			code    : exception.code,
			message : exception.message ?? getReasonPhrase(exception.code),
			data    : exception.handleJsonResponse() ?? null,
		};
	}

	public handleViewResponse(request: RequestContract, exception: Exception): ExceptionResponse {
		const isDev = Environment.isDev();

		const err = {
			title   : 'Uh oh, something went wrong.',
			code    : 500,
			message : exception.toString() ?? null,
			error   : exception?.message ?? null,
			stack   : exception?.stack ?? null,
		};

		if (!isDev) {
			err.message = 'Something went wrong...';
			err.error   = null;
			err.stack   = null;
		}

		return {
			message : err.message,
			code    : err.code,
			data    : err,
		};
	}

	public shouldHandle(exception: Exception): boolean {
		return (!Arr.has(this.ignoredExceptions, exception) || !Arr.has(this.internallyIgnoredExceptions, exception));
	}

	public isReportable(exception: Exception): boolean {
		return Arr.has(this.reportableExceptions, exception);
	}

	public isRenderable(exception: Exception): boolean {
		return Arr.has(this.renderableExceptions, exception);
	}

	private handleUnauthorised(error: Error): ExceptionResponse {
		return {
			code    : StatusCodes.UNAUTHORIZED,
			message : error.toString(),
			data    : {}
		};
	}
}
