import "reflect-metadata";
import * as path from "path";
import Environment from '../AppContainer/Config/Environment';
import 'jest-extended';

Environment.load(path.join(__dirname, '..', '..', '.env'));

import Configuration from "../Config/Configuration";
import {Envuso} from "../Envuso";

let envuso: Envuso = null;

export const bootApp = async function () {
	envuso = new Envuso();
	await Configuration.initiate();
	await envuso.boot();
	await envuso.serve();
};


export const unloadApp = async function () {
	await envuso.unload();
	envuso = null;
};

export const envusoTestService = envuso;
