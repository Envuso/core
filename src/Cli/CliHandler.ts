import "reflect-metadata";
import Environment from './../AppContainer/Config/Environment';
import {ConfigMetaGenerator, ControllerMetaGenerator, GenerateTypesFile, ModuleMetaGenerator, Program} from "@envuso/compiler";
import {config, resolve} from "../AppContainer";
import {Log} from "../Common";
import {SeedManager} from "../Database";
import {Envuso} from "../Envuso";


Environment.load();
Log.disable();

const envuso = new Envuso();

const yargs = require("yargs");

const runFrameworkLogic = (dev: boolean = false, logic: () => Promise<void>) => {

	const Configuration = dev ? require('./../Config/Configuration') : require('../../../../dist/Config/Configuration');

	Configuration.initiate()
		.then(() => envuso.initiateWithoutServing())
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
				const seederClass = config().get<string, any>('Database.seeder');
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
				GenerateTypesFile,
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
