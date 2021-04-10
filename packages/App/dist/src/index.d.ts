import { constructor } from "tsyringe/dist/typings/types";
import { App } from "./App";
export * from './App';
export * from './ServiceProvider';
export * from './Config/ConfigRepository';
export * from './Exceptions/FailedToBindException';
export { injectable, inject, DependencyContainer } from 'tsyringe';
export declare const resolve: <T>(identifier: string | constructor<T>) => T;
export declare const app: () => App;
