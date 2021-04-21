import {Request} from "./Context/Request/Request";
import {RequestContext} from "./Context/RequestContext";
import {Response} from "./Context/Response/Response";

export * from './RouteServiceProvider';
export * from './Context/Request/Request';
export * from './Context/Request/UploadedFile';
export * from './Context/Response/Response';
export * from './Context/RequestContext';
export * from './Context/RequestContextStore';
export * from './Context/RequestContext';
export * from './Context/RequestContextStore';
export * from './Controller/Controller';
export * from './Controller/ControllerDecorators';
export * from './Controller/ControllerManager';
export * from './DataTransferObject/DataTransferObject';
export * from './DataTransferObject/DtoValidationException';
export * from './Middleware/Middleware';
export * from './Middleware/MiddlewareDecorators';
export * from './Route/RequestInjection/index';
export * from './Route/Route';
export * from './Route/RouteDecorators';
export * from './Route/RouteManager';


export const request  = (): Request => RequestContext.request();
export const response = (): Response => RequestContext.response();
