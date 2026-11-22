import fs from "fs";
import path from "path";
import {ConfigurationCredentials} from "./ConfigurationCredentials";

export type ConfigFile = {
	name: string;
	config: Promise<{ default: new () => ConfigurationCredentials }>
	resolved: ConfigurationCredentials;
}

export default class ConfigurationFile {

	private static configFiles: ConfigFile[] = [];

	public add(name: string, configFile: any) {
		ConfigurationFile.configFiles.push({
			name     : name,
			config   : configFile,
			resolved : null,
		});
	}

	public static async initiate() {
		const config = new this();
		config.load();

		for (let pendingConfigurationFile of ConfigurationFile.configFiles) {
			const conf = Object.values((await pendingConfigurationFile.config)).shift() as (new () => ConfigurationCredentials);

			pendingConfigurationFile.resolved = new conf();
		}
	}

	public load() {

	}

	/**
	 * Where the app's Configuration.ts lives: `configurationDirectory` from the
	 * envuso.json in the project root, or src/Config by default.
	 */
	public static appConfigurationPath(cwd: string = process.cwd()): string {
		let directory = 'src/Config';

		try {
			const envusoJson = JSON.parse(fs.readFileSync(path.join(cwd, 'envuso.json'), 'utf8'));
			directory        = envusoJson.configurationDirectory || directory;
		} catch (error) {
			// No (readable) envuso.json: use the default
		}

		return path.resolve(cwd, directory, 'Configuration.ts');
	}

	/**
	 * Load and initiate the app's configuration, for processes that don't start
	 * from the app's own entry point (queue workers, the cli).
	 */
	public static async initiateAppConfiguration(configurationPath: string = this.appConfigurationPath()) {
		const module = await import(configurationPath);
		const configuration = module.default as typeof ConfigurationFile;

		if (!configuration?.initiate) {
			throw new Error(`${configurationPath} must default-export a class extending ConfigurationFile`);
		}

		await configuration.initiate();
	}

	static getConfigurationFiles(): ConfigFile[] {
		return this.configFiles;
	}

}
