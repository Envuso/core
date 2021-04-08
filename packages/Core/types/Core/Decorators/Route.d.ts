import { ControllerMetadata } from "./Controller";
export interface HandlerDecorator {
    (target: any, key: string, value: any): void;
}
export interface ControllerMethodParameterMetadata {
    name: string;
    type: any;
}
export interface ControllerMethodMetadata extends ControllerMetadata {
    method: string;
    key: string;
    parameters: ControllerMethodParameterMetadata[];
}
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
export declare function httpMethod(method: string, path: string): HandlerDecorator;
