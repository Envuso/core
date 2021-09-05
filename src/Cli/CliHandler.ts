import "reflect-metadata";
import {ConfigMetaGenerator, ControllerMetaGenerator, ModuleMetaGenerator, PrepareCompilerTask, Program} from "@envuso/compiler";
import {config as configDotEnv} from 'dotenv';
import {config, resolve} from "../AppContainer";
import {Log} from "../Common";
import {SeedManager} from "../Database";
import {Envuso} from "../Envuso";


Log.disable();

configDotEnv();

const envuso = new Envuso();

const yargs = require("yargs");

const runFrameworkLogic = (dev: boolean = false, logic: () => Promise<void>) => {
	const {Config} = dev ? require('./../Config') : require('../../../../dist/Config');

	envuso.initiateWithoutServing(Config)
		.then(() => logic())
		.then(() => process.exit())
		.catch(error => {
			console.error(error);
		});
};

export const run = (dev: boolean = false) => {
	yargs.command(
		'db:seed',
		'Run the database seeders. Seeders are defined in /src/Seeders/Seeders.ts.',
		(yargs) => {
		},
		(argv) => {
			runFrameworkLogic(dev, async () => {
				const seederClass = config('Database').seeder;
				if (seederClass) {
					const seeder = new seederClass();

					seeder.registerSeeders();

					await resolve(SeedManager).runSeeders();
				}
			});

		},
	);
	yargs.command(
		'build [--watch]',
		`Build your application using envuso's compiler.`,
		() => yargs.option('watch', {
			alias    : 'w',
			default  : false,
			boolean  : true,
			describe : 'If specified, the compiler will stay running and re-build when changes are detected.'
		}),
		async (argv) => {
			await Program.loadConfiguration();
			await Program.setup([
				PrepareCompilerTask,
				ConfigMetaGenerator,
				ControllerMetaGenerator,
				ModuleMetaGenerator,
			]);
			await Program.run(argv.watch);
		},
	);

	yargs.demandCommand(1);
	yargs.strict();
	yargs.parse();
};
