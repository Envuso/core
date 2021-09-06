import {Log} from "../../Common";
import {config} from "../index";
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

	static getConfigurationFiles(): ConfigFile[] {
		return this.configFiles;
	}

}
