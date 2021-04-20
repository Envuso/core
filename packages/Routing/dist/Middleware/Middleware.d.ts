import { RequestContext } from "../Context/RequestContext";
export declare abstract class Middleware {
    abstract handler(context: RequestContext): Promise<any>;
    static getMetadata(controller: any): any;
    static setMetadata(controller: any, middlewares: Middleware[]): void;
}
