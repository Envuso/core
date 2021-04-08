import { HttpRequest, HttpResponse } from "@Core";
import { interfaces } from "inversify";
export declare const resolve: <T>(identifier: interfaces.ServiceIdentifier<T>) => T;
export declare const app: <T>(identifier: interfaces.ServiceIdentifier<T>) => T;
export declare const request: () => HttpRequest;
export declare const response: () => HttpResponse;
