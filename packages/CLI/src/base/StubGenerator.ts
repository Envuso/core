import chalk from "chalk";
import * as fs from "fs";
import inquirer, {prompt} from 'inquirer';
import {snakeCase} from "lodash";
import * as path from 'path';
import * as stubs from './Stubs'

export class StubGenerator {

	private stubContents: string;

	/**
	 * @param stub
	 * @param nameSuffix
	 * @param stubPublishPath
	 * @param fileNameAndLocation
	 * @param useNameSuffixInFileName
	 */
	constructor(
		private stub: string,
		private nameSuffix: string,
		private stubPublishPath: string[],
		private fileNameAndLocation: string,
		private useNameSuffixInFileName: boolean = true
	) {
		this.stubContents = stubs[snakeCase('STUB_' + this.stub).toUpperCase()];
	}

	/**
	 * Replace all stub variables
	 *
	 * @param vars
	 */
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

	/**
	 * Get the full path of where the file will be saved
	 */
	get creationPath() {
		let fileName = this.parseFileName();

		if (!fileName.endsWith('.ts')) {
			fileName += '.ts';
		}

		return path.join(...this.stubPublishPath, fileName);
	}

	/**
	 * Check if we can create the controller at the path specified
	 */
	canCreateAtPath() {
		const filePath = this.creationPath.split('/');
		filePath.pop();

		return fs.existsSync(path.join(...filePath));
	}

	/**
	 * Check if a file already exists
	 */
	doesFileExistAlready() {
		return fs.existsSync(this.creationPath);
	}

	/**
	 * If a file already exists at the specified location
	 * we'll ask the user if they want to overwrite it.
	 */
	async askToOverwriteFile() {

		if (!this.doesFileExistAlready()) {
			return true;
		}

		interface resultType {
			overwrite: boolean;
		}

		const filePath = this.creationPath;

		console.clear();

		const message = [
			chalk.bold.yellow('A ' + this.nameSuffix + ' already exists at:'),
			chalk.bold(`> ${filePath}`),
			'',
			chalk.red('Are you sure you wish to create it? It will overwrite your file.')
		];

		const result: resultType = await prompt({
			type    : 'confirm',
			name    : 'overwrite',
			message : message.join('\n')
		});

		if (!result?.overwrite) {
			return false;
		}

		return true;
	}

	/**
	 * Save the changes to file
	 */
	save() {
		if (!this.canCreateAtPath()) {
			return false;
		}

		fs.writeFileSync(this.creationPath, this.stubContents);

		return true;
	}

	/**
	 * If we're trying to create a stub in folder/name/controller
	 * for example. We need to ensure that these directories
	 * exist and create them if they dont
	 */
	generateNonExistentDirectories() {
		const directories = [...this.stubPublishPath];

		if (this.fileNameAndLocation.includes('/')) {
			const controllerDirs = this.fileNameAndLocation.split('/');
			controllerDirs.pop();

			directories.push(...controllerDirs);
		}

		let dirChecks = [];
		for (let directory of directories) {
			const dir = path.join('.', ...dirChecks, directory);

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}

			dirChecks.push(directory)
		}
	}

	/**
	 * Try to ensure that the file name/location is correct
	 */
	parseFileName() {
		let fileName = this.fileNameAndLocation;

		if (fileName.includes('/')) {
			fileName = fileName.split('/').pop()
		}

		if (this.useNameSuffixInFileName) {
			if (!fileName.includes(this.nameSuffix)) {
				fileName += this.nameSuffix;
			}
		}

		if (fileName.includes('.ts')) {
			fileName = fileName.replace('.ts', '');
		}

		if (fileName.includes('.js')) {
			fileName = fileName.replace('.js', '');
		}

		return fileName;
	}

	/**
	 * Run all checks to see if we can create the file
	 */
	prepareToCreateFile(): Promise<boolean> {
		if (!this.canCreateAtPath()) {
			this.generateNonExistentDirectories();
		}

		if (!this.canCreateAtPath()) {
			return Promise.resolve(false);
		}

		return this.askToOverwriteFile();
	}
}
