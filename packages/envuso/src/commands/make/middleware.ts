import {Command, flags} from '@oclif/command'
import chalk from "chalk";
import {StubGenerator} from "./../../base/StubGenerator";
import {camelCase} from 'lodash';

export default class Middleware extends Command {

	static title = 'make:middleware';

	static description = 'Create a middleware'

	static examples = [
		`$ envuso make:middleware User`,
	]

	static flags = {
		help : flags.help({char : 'h'}),
	}

	static args = [
		{
			description : 'Set a name for your middleware(Does not need to contain "Middleware" this will be automatically added.)',
			name        : 'name',
			type        : 'string',
			required    : true,
		}
	]

	async run() {
		const {args, flags} = this.parse(Middleware)

		const generator = new StubGenerator(
			'MIDDLEWARE',
			'Middleware',
			['src', 'App', 'Http', 'Middleware'],
			args.name
		);

		generator.replace({});

		if (!await generator.prepareToCreateFile()) {
			this.warn(chalk.yellow('Middleware was not created at: ' + generator.creationPath));

			return;
		}

		generator.save();
	}
}