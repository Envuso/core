import {dotnotate} from "@zishone/dotnotate";

export class ConfigRepository {

	/**
	 * All of the Config loaded into the repository
	 *
	 * @private
	 */
	private _config: any;

	/**
	 * Load all available Configuration
	 *
	 * We'll use dotnotate to allow us to access a value with a string
	 * like "services.app", but then merge it with the original
	 * so we can also access a base object like "services"
	 *
	 *
	 * @param configDirectory
	 * @private
	 */
	async loadConfigFrom(configDirectory: string) {
		const conf = await import(configDirectory);

		this._config = {...dotnotate(conf.Config), ...conf.Config};
	}

	/**
	 * Get a Config value by key
	 *
	 * @param key
	 * @param _default
	 */
	get<T>(key: string, _default: any = null): T {
		return this._config[key] as T ?? _default;
	}

	/**
	 * Set a Config on the repository
	 *
	 * @param key
	 * @param value
	 */
	set(key: string, value: any) {

		const constructedConfig = {};
		constructedConfig[key] = value;

		const configToSet = {...dotnotate(constructedConfig), ...constructedConfig};

		this._config = {...this._config, ...configToSet};
	}

	/**
	 * Does a key exist in the Config?
	 *
	 * @param key
	 */
	has(key: string): boolean {
		return !!this._config[key];
	}
}
