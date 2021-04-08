import {Command, flags} from "@oclif/command";
import chalk from "chalk";

export default class Make extends Command {

	static title = 'make';

	static description = 'Create all types of framework files'

	static examples = [
		`$ envuso make:controller -h`,
		`$ envuso make:middleware -h`,
		`$ envuso make:model -h`,
	]

	static flags = {
		help : flags.help({char : 'h'}),
	}


	async run() {
		const {args, flags} = this.parse(Make)

		this.log(
			[
				chalk.bold(`Available make sub commands are:`),
				`${chalk.blue.bold('>')} make:controller`,
				`${chalk.blue.bold('>')} make:middleware`,
				`${chalk.blue.bold('>')} make:model`,
			].join('\n')
		)

	}
}
