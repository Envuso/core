import {config} from "../../AppContainer";
import Environment from "../../AppContainer/Config/Environment";

export enum StatusCodeTextType {
	'Continue'                        = 100,
	'Switching Protocols'             = 101,
	'Processing'                      = 102,            // RFC2518
	'Early Hints'                     = 103,
	'OK'                              = 200,
	'Created'                         = 201,
	'Accepted'                        = 202,
	'Non-Authoritative Information'   = 203,
	'No Content'                      = 204,
	'Reset Content'                   = 205,
	'Partial Content'                 = 206,
	'Multi-Status'                    = 207,          // RFC4918
	'Already Reported'                = 208,      // RFC5842
	'IM Used'                         = 226,               // RFC3229
	'Multiple Choices'                = 300,
	'Moved Permanently'               = 301,
	'Found'                           = 302,
	'See Other'                       = 303,
	'Not Modified'                    = 304,
	'Use Proxy'                       = 305,
	'Temporary Redirect'              = 307,
	'Permanent Redirect'              = 308,    // RFC7238
	'Bad Request'                     = 400,
	'Unauthorized'                    = 401,
	'Payment Required'                = 402,
	'Forbidden'                       = 403,
	'Not Found'                       = 404,
	'Method Not Allowed'              = 405,
	'Not Acceptable'                  = 406,
	'Proxy Authentication Required'   = 407,
	'Request Timeout'                 = 408,
	'Conflict'                        = 409,
	'Gone'                            = 410,
	'Length Required'                 = 411,
	'Precondition Failed'             = 412,
	'Payload Too Large'               = 413,
	'URI Too Long'                    = 414,
	'Unsupported Media Type'          = 415,
	'Range Not Satisfiable'           = 416,
	'Expectation Failed'              = 417,
	'I\'m a teapot'                   = 418,                                               // RFC2324
	'Misdirected Request'             = 421,                                         // RFC7540
	'Unprocessable Entity'            = 422,                                        // RFC4918
	'Locked'                          = 423,                                                      // RFC4918
	'Failed Dependency'               = 424,                                           // RFC4918
	'Too Early'                       = 425,                                                   // RFC-ietf-httpbis-replay-04
	'Upgrade Required'                = 426,                                            // RFC2817
	'Precondition Required'           = 428,                                       // RFC6585
	'Too Many Requests'               = 429,                                           // RFC6585
	'Request Header Fields Too Large' = 431,                             // RFC6585
	'Unavailable For Legal Reasons'   = 451,                               // RFC7725
	'Internal Server Error'           = 500,
	'Not Implemented'                 = 501,
	'Bad Gateway'                     = 502,
	'Service Unavailable'             = 503,
	'Gateway Timeout'                 = 504,
	'HTTP Version Not Supported'      = 505,
	'Variant Also Negotiates'         = 506,                                     // RFC2295
	'Insufficient Storage'            = 507,                                        // RFC4918
	'Loop Detected'                   = 508,                                               // RFC5842
	'Not Extended'                    = 510,                                                // RFC2774
	'Network Authentication Required' = 511,                             // RFC6585
}

export type StatusCodeToType = {
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',            // RFC2518
	103: 'Early Hints',
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	203: 'Non-Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi-Status',          // RFC4918
	208: 'Already Reported',      // RFC5842
	226: 'IM Used',               // RFC3229
	300: 'Multiple Choices',
	301: 'Moved Permanently',
	302: 'Found',
	303: 'See Other',
	304: 'Not Modified',
	305: 'Use Proxy',
	307: 'Temporary Redirect',
	308: 'Permanent Redirect',    // RFC7238
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Payload Too Large',
	414: 'URI Too Long',
	415: 'Unsupported Media Type',
	416: 'Range Not Satisfiable',
	417: 'Expectation Failed',
	418: 'I\'m a teapot',                                               // RFC2324
	421: 'Misdirected Request',                                         // RFC7540
	422: 'Unprocessable Entity',                                        // RFC4918
	423: 'Locked',                                                      // RFC4918
	424: 'Failed Dependency',                                           // RFC4918
	425: 'Too Early',                                                   // RFC-ietf-httpbis-replay-04
	426: 'Upgrade Required',                                            // RFC2817
	428: 'Precondition Required',                                       // RFC6585
	429: 'Too Many Requests',                                           // RFC6585
	431: 'Request Header Fields Too Large',                             // RFC6585
	451: 'Unavailable For Legal Reasons',                               // RFC7725
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',                                     // RFC2295
	507: 'Insufficient Storage',                                        // RFC4918
	508: 'Loop Detected',                                               // RFC5842
	510: 'Not Extended',                                                // RFC2774
	511: 'Network Authentication Required',                             // RFC6585
}

export const statusCodeTextMapping = {
	100 : 'Continue',
	101 : 'Switching Protocols',
	102 : 'Processing',            // RFC2518
	103 : 'Early Hints',
	200 : 'OK',
	201 : 'Created',
	202 : 'Accepted',
	203 : 'Non-Authoritative Information',
	204 : 'No Content',
	205 : 'Reset Content',
	206 : 'Partial Content',
	207 : 'Multi-Status',          // RFC4918
	208 : 'Already Reported',      // RFC5842
	226 : 'IM Used',               // RFC3229
	300 : 'Multiple Choices',
	301 : 'Moved Permanently',
	302 : 'Found',
	303 : 'See Other',
	304 : 'Not Modified',
	305 : 'Use Proxy',
	307 : 'Temporary Redirect',
	308 : 'Permanent Redirect',    // RFC7238
	400 : 'Bad Request',
	401 : 'Unauthorized',
	402 : 'Payment Required',
	403 : 'Forbidden',
	404 : 'Not Found',
	405 : 'Method Not Allowed',
	406 : 'Not Acceptable',
	407 : 'Proxy Authentication Required',
	408 : 'Request Timeout',
	409 : 'Conflict',
	410 : 'Gone',
	411 : 'Length Required',
	412 : 'Precondition Failed',
	413 : 'Payload Too Large',
	414 : 'URI Too Long',
	415 : 'Unsupported Media Type',
	416 : 'Range Not Satisfiable',
	417 : 'Expectation Failed',
	418 : 'I\'m a teapot',                                               // RFC2324
	421 : 'Misdirected Request',                                         // RFC7540
	422 : 'Unprocessable Entity',                                        // RFC4918
	423 : 'Locked',                                                      // RFC4918
	424 : 'Failed Dependency',                                           // RFC4918
	425 : 'Too Early',                                                   // RFC-ietf-httpbis-replay-04
	426 : 'Upgrade Required',                                            // RFC2817
	428 : 'Precondition Required',                                       // RFC6585
	429 : 'Too Many Requests',                                           // RFC6585
	431 : 'Request Header Fields Too Large',                             // RFC6585
	451 : 'Unavailable For Legal Reasons',                               // RFC7725
	500 : 'Internal Server Error',
	501 : 'Not Implemented',
	502 : 'Bad Gateway',
	503 : 'Service Unavailable',
	504 : 'Gateway Timeout',
	505 : 'HTTP Version Not Supported',
	506 : 'Variant Also Negotiates',                                     // RFC2295
	507 : 'Insufficient Storage',                                        // RFC4918
	508 : 'Loop Detected',                                               // RFC5842
	510 : 'Not Extended',                                                // RFC2774
	511 : 'Network Authentication Required',                             // RFC6585
};

function getStatusText(code: keyof StatusCodeToType): string {
	return StatusCodeTextType[statusCodeTextMapping[code]];
}

export const renderableExceptions = {
	401 : {
		code    : 401,
		title   : statusCodeTextMapping["401"],
		message : statusCodeTextMapping["401"],
	},
	403 : {
		code    : 403,
		title   : statusCodeTextMapping['403'],
		message : statusCodeTextMapping['403'],
	},
	404 : {
		code    : 404,
		title   : statusCodeTextMapping['404'],
		message : statusCodeTextMapping['404'],
	},
	419 : {
		code    : 419,
		title   : statusCodeTextMapping['419'],
		message : statusCodeTextMapping['419'],
	},
	429 : {
		code    : 429,
		title   : statusCodeTextMapping['429'],
		message : statusCodeTextMapping['429'],
	},
	500 : {
		code    : 500,
		title   : statusCodeTextMapping['500'],
		message : statusCodeTextMapping['500'],
	},
	503 : {
		code    : 503,
		title   : statusCodeTextMapping['503'],
		message : statusCodeTextMapping['503'],
	},
};

function canRenderViewForException(code: number): boolean {
	return renderableExceptions[code] !== undefined;
}

function renderableExceptionData(code: number, error: Error): { title: string, code: number, message: string, stack: string, error: string } {
	const isDev = Environment.isDev();

	const err = {
		message : error?.toString() ?? null,
		stack   : error?.stack ?? null,
		error   : error?.message ?? null,
	};

	if (!canRenderViewForException(code)) {
		return {
			title   : 'Uh oh, something went wrong.',
			code    : 500,
			message : isDev ? err.message : 'Something went wrong...',
			stack   : isDev ? err.stack : null,
			error   : isDev ? err.error : null,
		};
	}

	const viewData = renderableExceptions[code];
	viewData.stack = null;
	viewData.error = null;

	if (isDev) {
		viewData.stack = err.stack;
		viewData.error = err.message;
	}

	return viewData;
}

export {getStatusText, canRenderViewForException, renderableExceptionData};

