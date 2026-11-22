import type {constructor} from "tsyringe/dist/typings/types";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";

import {App} from "./App";

// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: constructor<T> | string): T => App.getInstance().resolve<T>(identifier);
export const app     = (): AppContract => App.getInstance();

export function config(): ConfigRepositoryContract;
export function config<T extends any>(key: string, _default?:any): T;
export function config<T extends any>(key?: string, _default?:any): T | ConfigRepositoryContract {
	if (key) {
		return App.getInstance().config().get(key, _default);
	}

	return App.getInstance().config();
}
