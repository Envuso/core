import "reflect-metadata";
import * as path from "path";
import {ServiceProvider} from "../AppContainer";
import Environment from '../AppContainer/Config/Environment';
import 'jest-extended';

Environment.load(path.join(__dirname, '..', '..', '.env'));

import Configuration from "../Config/Configuration";
import {Database} from "../Database";
import {Envuso} from "../Envuso";

let envuso: Envuso = null;

export const bootApp = async function (serve: boolean = true, ignoredServiceProviders: (new () => ServiceProvider)[] = []) {
	envuso = new Envuso();
	await Configuration.initiate();
	await envuso.boot(ignoredServiceProviders);
	if (serve) {
		await envuso.serve();
	}
};


export const unloadApp = async function (exitOnFinish: boolean = false) {
	await envuso.unload();
	envuso = null;

	if (exitOnFinish)
		process.exit(0);
};


export const envusoTestService = envuso;
