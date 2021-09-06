import {constructor} from "tsyringe/dist/typings/types";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";

import {App} from "./App";

// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: constructor<T> | string): T => App.getInstance().resolve<T>(identifier);
export const app     = (): AppContract => App.getInstance();

function config(): ConfigRepositoryContract;
function config<T extends any>(key: string, _default?:any): T;
function config<T extends any>(key?: string, _default?:any): T | ConfigRepositoryContract {
	if (key) {
		return App.getInstance().config().get(key, _default);
	}

	return App.getInstance().config();
}

export {config};
export * from './ServiceProvider';
export * from './App';
export * from './Config/ConfigRepository';
export * from './Config/ConfigurationCredentials';
export * from './Config/ConfigurationFile';
export * from './Config/Environment';
export * from './Exceptions/FailedToBindException';
export {injectable, autoInjectable, singleton, scoped, inject, DependencyContainer} from 'tsyringe';
