import chalk from "chalk";
import * as fs from "fs";
import _ from "lodash";
import path from "path";
import console from 'chalk-console';
import {prompt} from 'enquirer';
import * as stubs from './Stubs'

export class StubGenerator {

	private readonly stub: string;
	private stubContents: string;
	private readonly nameSuffix: string;
	private readonly stubPublishPath: string[];
	private fileNameAndLocation: string;


	constructor(
		stub: string,
		nameSuffix: string,
		stubPublishPath: string[],
		fileNameAndLocation: string
	) {
		this.stubPublishPath     = stubPublishPath;
		this.fileNameAndLocation = fileNameAndLocation;
		this.stub                = stub;
		this.nameSuffix          = nameSuffix;

		this.stubContents = stubs[_.snakeCase('STUB_' + this.stub).toUpperCase()];

	}

	parseFileName() {

		let fileName = this.fileNameAndLocation;

		if (fileName.includes('/')) {
			fileName = fileName.split('/').pop()
		}

		if (!fileName.includes(this.nameSuffix)) {
			fileName += this.nameSuffix;
		}

		if (fileName.includes('.ts')) {
			fileName = fileName.replace('.ts', '');
		}

		if (fileName.includes('.js')) {
			fileName = fileName.replace('.js', '');
		}

		return fileName;
	}

	replace(vars: Object) {
		const varsToReplace = {...vars, ...{name : this.parseFileName()}}

		for (let key of Object.keys(varsToReplace)) {
			const replaceKey = `{{${key}}}`;
			do {
				this.stubContents = this.stubContents.replace(replaceKey, varsToReplace[key]);
			} while (this.stubContents.includes(replaceKey));
		}

		return this;
	}

	save() {

		let controllerName = this.parseFileName();

		if (this.fileNameAndLocation.includes('/')) {
			const directories = this.fileNameAndLocation.split('/');
			directories.pop();
			const baseDirs = this.stubPublishPath;

			for (let directory of directories) {
				const dir = path.join(...this.stubPublishPath, directory);

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}

				baseDirs.push(directory)
			}

		}

		if (!controllerName.endsWith('.ts')) {
			controllerName += '.ts';
		}

		const controllerPath = path.join(...this.stubPublishPath, controllerName);

		const run = async () => {
			if (fs.existsSync(controllerPath)) {
				interface resultType {
					overwrite: boolean;
				}

				const result: resultType = await prompt({
					type    : 'confirm',
					name    : 'overwrite',
					message :
						`${chalk.yellow('A controller already exists at:')} \n>> ${controllerPath}\n${chalk.red('Are you sure? It will overwrite your file.')}`
				});

				if (!result?.overwrite) {
					console.yellow(this.nameSuffix + ' wasnt published');
					return;
				}

			}

			fs.writeFileSync(controllerPath, this.stubContents);

			console.green(this.nameSuffix + ' published to: ' + controllerPath);
		}

		run()
			.catch(error => console.error)
			.finally(() => process.exit());
	}

}
