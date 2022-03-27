import * as path from "path";
import {ServiceProvider} from "../AppContainer";
import {Exception, FileLoader} from "../Common";
import Log from "../Common/Logger/Log";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Kernel} from "./Kernel";

const cron = require('node-cron');

export class ConsoleServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const kernel = await FileLoader.importClassesOfTypeFrom(path.join(config.get<string, any>('Paths.commands'), 'CommandKernel.ts'), 'Kernel');
		if (!kernel?.length) {
			throw new Exception('Failed to find CommandKernel.ts at App/Console/CommandKernel.ts');
		}

		app.container().register(Kernel, {useValue : new (kernel[0].instance)()});
		app.container().register('kernel', {useValue : new (kernel[0].instance)()});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const modules = await FileLoader.importClassesOfTypeFrom(
			path.join(config.get<string, any>('Paths.commands'), 'Commands', '**', '*.ts'), 'Command'
		);

		for (let module of modules) {
			app.container().register('command:' + module.name, module.instance);
			Log.label('CONSOLE KERNEL').success(`Successfully registered console command ${module.name}`);
		}

		const kernel = app.container().resolve(Kernel);
		kernel.registerSchedules();
		for (let command of kernel.commands) {
			cron.schedule(command.schedule.getCronTab(), function () {
				console.log('Running cron: ' + command.name);
			});
		}
	}

}
