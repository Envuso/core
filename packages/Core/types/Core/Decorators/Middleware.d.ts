import { Middleware as BaseMiddleware } from "../Providers/Http/Controller/Middleware";
export declare type RouteMiddleware = BaseMiddleware;
export declare function middleware(middleware: RouteMiddleware): any;
