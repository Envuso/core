import {constructor} from "tsyringe/dist/typings/types";
import {App} from "./App";
import {ConfigRepository} from "./Config/ConfigRepository";

export * from './ServiceProvider';
export * from './App';
export * from './Config/ConfigRepository';
export * from './Exceptions/FailedToBindException';
export {injectable, autoInjectable, singleton, scoped, inject, DependencyContainer} from 'tsyringe';

// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: constructor<T> | string): T => App.getInstance().resolve<T>(identifier);
export const app     = (): App => App.getInstance();

function config(): ConfigRepository;
function config<T>(key: string, _default?: any): T;
function config<T>(key?: string, _default?: any): T | ConfigRepository {
	if (key) {
		return App.getInstance().config().get<T>(key, _default ?? null);
	}

	return App.getInstance().config();
}

export {config};
