import {constructor} from "tsyringe/dist/typings/types";
import {App} from "./App";

export * from './App'
export * from './ServiceProvider';
export * from './Config/ConfigRepository';
export * from './Exceptions/FailedToBindException';
export {injectable, inject, DependencyContainer} from 'tsyringe';

// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: constructor<T> | string): T => App.getInstance().resolve<T>(identifier);
export const app     = (): App => App.getInstance();
