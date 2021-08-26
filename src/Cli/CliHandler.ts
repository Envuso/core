import "reflect-metadata";
//@ts-ignore
global.disableConsoleLogs = true;

import {config} from 'dotenv';

config();

import {Envuso} from "../Envuso";
import {resolve, config as appConfig} from "../AppContainer";
import {DatabaseSeeder, SeedManager} from "../Database";

const envuso = new Envuso();

const yargs = require("yargs");

export const run = (dev: boolean = false) => {
	const config = dev ? require('./../Config') : require('../../../../dist/Config');

	yargs.command(
		'db:seed',
		'Run the database seeders. Seeders are defined in /src/Seeders/Seeders.ts.',
		(yargs) => {
		},
		(argv) => {
			envuso.initiateWithoutServing(config)
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
	yargs.demandCommand(1);
	yargs.strict();
	yargs.parse();
};
