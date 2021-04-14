import {Command, flags} from '@oclif/command'
import * as boxen from "boxen";
import chalk from "chalk";
import * as fs from "fs";
import * as Listr from "listr";
import * as path from "path";
//@ts-ignore
import * as clone from 'git-clone'
import {Observable} from "rxjs";
//@ts-ignore
import * as terminalLink from 'terminal-link';
import * as inquirer from 'inquirer'
import {exec, ExecException} from 'child_process';


export default class New extends Command {

	static description = 'Create a new project'

	static examples = [
		`$ envuso new`,
	]

	static flags = {
		help : flags.help({char : 'h'}),
		// flag with a value (-n, --name=VALUE)
//    name: flags.string({char: 'n', description: 'project name', required : true}),
	}

	static args = []

	async run() {
		const {args, flags} = this.parse(New)
		const cwd           = process.cwd();

		const projectNameResponse = await inquirer.prompt({
			name    : 'projectName',
			message : 'Project folder name?',
			type    : 'input'
		});

		const projectDir = path.join(cwd, projectNameResponse.projectName);

		const confirmedDirectory = await inquirer.prompt({
			name    : 'confirmed',
			type    : 'confirm',
			message : 'Your project will be created at: ' +
				chalk.cyan(projectDir) +
				'\n' +
				'Is this okay?'
		});

		if (!confirmedDirectory.confirmed) {
			this.log(chalk.yellow('Project creation cancelled.'));

			return;
		}

		if (fs.existsSync(projectDir)) {
			this.warn('This directory already exists. Please choose a different location.');

			return;
		}
		const packageManagerResponse = await inquirer.prompt({
			name    : 'manager',
			type    : 'list',
			message : 'Which package manager do you wish to use?',
			choices : [{name : 'npm'}, {name : 'yarn'}]
		});

		const tasks = new Listr([
			{
				title : 'Prepare Project',
				task  : () => {
					return new Observable(observer => {
						observer.next('Cloning Repository...');

						clone('https://github.com/Envuso/framework', projectDir, async () => {
							observer.complete();
						});
					});
				}
			},
			{
				title : 'Checking directory exists...',
				task  : () => {
					return new Observable(observer => {
						if (!fs.existsSync(projectDir)) {
							throw new Error('Project directory doesnt exist for some reason...')
						}
						observer.complete();
					});
				}
			},
			{
				title : 'Installing dependencies',
				task  : (ctx, task) => {
					return new Observable((observable) => {
						const cmd = this.getPackageManagerArgs(projectDir, packageManagerResponse.manager);
						if (!cmd) {
							throw new Error('Hmmm... something went wrong');
						}

						exec(String(`${cmd}`), (error: ExecException | null, stdout: string, stderr: string) => {
							if (error === null) {
								observable.complete();
								return;
							}
							if (error) {
								throw error;
							}
							if (stderr) {
								throw new Error(stderr);
							}

							observable.next(stdout);
						})
					})
				}
			}
		]);

		try {
			await tasks.run();

			this.log(this.completionText(packageManagerResponse.manager, projectNameResponse.projectName))
		} catch (error) {
			this.error(error);
		}
	}

	getPackageManagerArgs(projectDirectory: string, manager: string) {
		switch (manager) {
			case 'yarn':
				return `yarn --cwd ${projectDirectory}`;
			case 'npm':
				return `npm --prefix ${projectDirectory} install`;
		}

		return '';
	}

	completionText(packageManager: string, projectName: string) {
		const link = terminalLink('', 'https://envuso.com/docs');


		const envusoText = boxen(chalk.bold.bgBlue.whiteBright(' ENVUSO '),
			{
				backgroundColor : "blue",
				borderColor     : "blue",
				borderStyle     : "round",
				padding         : 0,
				align           : "center",
			});

		return boxen(
			envusoText +
			'\n' +
			'\n' +
			'Next Steps:' +
			'\n' +
			chalk.bold('cd ' + projectName) +
			'\n' +
			chalk.bold('Check package.json scripts to compile & run :)') +
			'\n' +
			'\n' +
			chalk.bold('Don\'t forget to visit the Envuso Documentation') +
			'\n' +
			'' + link,
			{
				borderColor : "blue",
				borderStyle : "round",
				padding     : 1,
				align       : "center",
				margin      : 0
			});
	}

}
