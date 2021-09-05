import {constructor} from "tsyringe/dist/typings/types";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Config, ConfigHelperKeys} from "../Meta/Configuration";

import {App} from "./App";

// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: constructor<T> | string): T => App.getInstance().resolve<T>(identifier);
export const app     = (): AppContract => App.getInstance();

//<T extends (keyof ConfigHelperKeys|string)>(key: T | string, _default: any = null): T extends keyof ConfigHelperKeys ? ConfigHelperKeys[T] : T {

function config(): ConfigRepositoryContract;
function config<T extends keyof (typeof Config)>(key: T): (typeof Config)[T];
function config<T extends keyof (typeof Config)>(key?: T): (typeof Config)[T] | ConfigRepositoryContract {
	if (key) {
		return App.getInstance().config().file(key);
	}

	return App.getInstance().config();
}

export {config};
export * from './ServiceProvider';
export * from './App';
export * from './Config/ConfigRepository';
export * from './Exceptions/FailedToBindException';
export {injectable, autoInjectable, singleton, scoped, inject, DependencyContainer} from 'tsyringe';
