import "reflect-metadata";
//@ts-ignore
global.disableConsoleLogs = true;

import {config} from 'dotenv';

config();

import {Config} from "../Config";
import {DatabaseSeeder, SeedManager} from "../Database";
import {resolve, config as appConfig} from "../AppContainer";
import {Envuso} from "../Envuso";

const envuso = new Envuso();

const yargs = require("yargs");

yargs.command(
	'db:seed',
	'Run the database seeders',
	(yargs) => {
	},
	(argv) => {
		envuso.initiateWithoutServing(Config)
			.then(() => {
				const seederClass = appConfig<(new () => DatabaseSeeder)>('database.seeder');
				const seeder      = new seederClass();

				seeder.registerSeeders();

				return resolve(SeedManager).runSeeders();
			})
			.then(() => process.exit())
			.catch(error => {
				console.error(error);
			});
	},
);

yargs.parse();
