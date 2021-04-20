import { HTTPMethods } from "fastify";
import { ControllerMethodMetadata } from "../Route/Route";
export interface AllControllerMeta {
    controller: ControllerMetadata;
    methods: ControllerMethodMetadata[];
}
export interface ControllerMetadata {
    path: string;
    target: any;
    injectionParams?: any[];
}
export interface HandlerDecorator {
    (target: any, key: string, value: any): void;
}
/**
 * Allows us to use an @controller('/path') decorator
 * to register this as a controller
 *
 * @param path
 */
export declare function controller(path?: string): (target: any) => void;
export declare function all(path: string): HandlerDecorator;
export declare function get(path: string): HandlerDecorator;
export declare function post(path: string): HandlerDecorator;
export declare function put(path: string): HandlerDecorator;
export declare function patch(path: string): HandlerDecorator;
export declare function head(path: string): HandlerDecorator;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export declare function destroy(path: string): HandlerDecorator;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
export declare function remove(path: string): HandlerDecorator;
/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 */
export declare function delete_(path: string): HandlerDecorator;
/**
 * Specify the HTTP methods you want to use explicitly
 *
 * @param methods
 * @param path
 */
export declare function method(methods: HTTPMethods | HTTPMethods[], path: string): HandlerDecorator;
export declare function httpMethod(method: HTTPMethods | HTTPMethods[], path: string): HandlerDecorator;
