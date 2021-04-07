import { interfaces } from "inversify";
import { HttpRequest } from "@Core/Providers";
import { HttpResponse } from "@Core/Providers";
export declare const resolve: <T>(identifier: interfaces.ServiceIdentifier<T>) => T;
export declare const app: <T>(identifier: interfaces.ServiceIdentifier<T>) => T;
export declare const request: () => HttpRequest;
export declare const response: () => HttpResponse;
