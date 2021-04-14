import {Command, flags} from '@oclif/command'
import chalk from "chalk";
import {StubGenerator} from "./../../base/StubGenerator";
import { camelCase } from 'lodash';

export default class Controller extends Command {

	static title = 'make:controller';

	static description = 'Create a controller'

	static examples = [
		`$ envuso make:controller User`,
		`$ envuso make:controller User --resource`,
		`$ envuso make:controller User --resource --model=User `,
	]

	static flags = {
		help     : flags.help({char : 'h'}),
		resource : flags.boolean({
			description : 'Create a resource controller(Controller using GET, PUT, POST, PATCH, DELETE)',
			char        : 'r',
			name        : 'resource',
			type        : 'boolean',
			default     : false
		}),
		model    : flags.string({
			description : 'Create a resource controller using your model',
			char        : 'm',
			name        : 'model',
			dependsOn   : ['resource'],
		})
	}

	static args = [
		{
			description : 'Set a name for your controller(Does not need to contain "Controller" this will be automatically added.)',
			name        : 'name',
			type        : 'string',
			required    : true,
		}
	]

	async run() {
		const {args, flags} = this.parse(Controller)

		let stub = 'controller';
		if (flags.resource && !flags.model) {
			stub = 'RESOURCE_CONTROLLER';
		}
		if (flags.resource && flags.model) {
			stub = 'CONTROLLER_W_MODELS';
		}

		const generator = new StubGenerator(
			stub,
			'Controller',
			['src', 'App', 'Http', 'Controllers'],
			args.name
		);

		if(flags.resource && flags.model){
			generator.replace({
				modelParamName : camelCase(flags.model),
				modelName      : flags.model
			});
		} else {
			generator.replace({});
		}


		if (!await generator.prepareToCreateFile()) {
			this.warn(chalk.yellow('Controller was not created at: ' + generator.creationPath));

			return;
		}

		generator.save();
	}
}
