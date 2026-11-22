import Environment from "../../AppContainer/Config/Environment";
import type {ExceptionHandlerContract} from "../../Contracts/Common/Exception/ExceptionHandlerContract";
import type {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import type {RedirectResponseContract} from "../../Contracts/Routing/Context/Response/RedirectResponseContract";
import {DtoValidationException} from "../../Routing/DataTransferObject/DtoValidationException";
import {getReasonPhrase} from "../Http/StatusCodes/Mapper";
import {StatusCodes} from "../Http/StatusCodes/StatusCodes";
import Log from "../Logger/Log";
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

	public static handle(request: RequestContract, exception: Exception | Error): ExceptionResponse | RedirectResponseContract {
		const isDev = Environment.isDev();

		const exceptionHandler = new ExceptionHandler();

		if (!(exception instanceof Exception)) {

			// Fastify's own client errors (bad JSON 400, 413 body too large, 415 media type...)
			// carry their status code and a message meant for the client
			const statusCode = (exception as any)?.statusCode;
			if (Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 500) {
				return {
					code    : statusCode,
					message : exception.message || getReasonPhrase(statusCode),
					data    : {}
				};
			}

			Log.label('Exception Handler').exception(exception.toString(), exception);

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

	public process(request: RequestContract, exception: Exception): ExceptionResponse | RedirectResponseContract | null {
		const isDev = Environment.isDev();

		if (exception instanceof DtoValidationException && (!request.expectsJson() || request.hasHeader('X-Inertia'))) {
			return request.redirectResponse()
				.to(request.getPreviousUrl())
				.with('errors', exception.getValidationErrors());
		}

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
			code    : exception.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
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
		return !this.isInstanceOfAny(exception, this.ignoredExceptions)
			&& !this.isInstanceOfAny(exception, this.internallyIgnoredExceptions);
	}

	public isReportable(exception: Exception): boolean {
		return this.isInstanceOfAny(exception, this.reportableExceptions);
	}

	public isRenderable(exception: Exception): boolean {
		return this.isInstanceOfAny(exception, this.renderableExceptions);
	}

	/**
	 * The lists hold exception classes; the exception is an instance
	 */
	private isInstanceOfAny(exception: Exception, types: (new () => Exception)[]): boolean {
		return types.some(type => exception instanceof type);
	}

	private handleUnauthorised(error: Error): ExceptionResponse {
		return {
			code    : StatusCodes.UNAUTHORIZED,
			message : error.toString(),
			data    : {}
		};
	}
}
