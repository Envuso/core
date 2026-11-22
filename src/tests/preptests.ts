import "reflect-metadata";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import Environment from '../AppContainer/Config/Environment';

Environment.load();

import Configuration from "../Config/Configuration";
import {Database} from "../Database/Database";
import {Envuso} from "../Envuso";

let envuso: Envuso = null;

export const bootApp = async function (serve: boolean = true, ignoredServiceProviders: (new () => ServiceProvider)[] = []) {
	// bun test runs every spec in one process, so make sure a previous boot is fully torn down
	if (envuso) {
		await unloadApp();
	}

	envuso = new Envuso();
	await Configuration.initiate();
	await envuso.boot(ignoredServiceProviders);
	if (serve) {
		await envuso.serve();
	}
};


export const unloadApp = async function (exitOnFinish: boolean = false) {
	if (!envuso) {
		return;
	}

	await envuso.unload();
	envuso = null;

	if (exitOnFinish)
		process.exit(0);
};


export const envusoTestService = envuso;
