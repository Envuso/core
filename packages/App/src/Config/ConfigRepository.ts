import get from "lodash.get";
import set from "lodash.set";
import has from "lodash.has";

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
	 * We'll pass the config in here via the object that is registered in the apps boot
	 * process. Previously it tried to import the file from the path path specified,
	 * this didn't work when compiled because it was /src/ not /dist/
	 *
	 * @private
	 */
	async loadConfigFrom(config: object) {
//		const conf = await import(configDirectory);

		this._config = config;
	}

	/**
	 * Get a Config value by key
	 *
	 * @param key
	 * @param _default
	 */
	get<T>(key: string, _default: any = null): T {
		return get<T>(this._config, key, _default);
		//return this._config[key] as T ?? _default;
	}

	/**
	 * Set a Config on the repository
	 *
	 * @param key
	 * @param value
	 */
	set(key: string, value: any) {
		set(this._config, key, value);
//		const constructedConfig = {};
//
//		if(key.includes('.')){
//			const keys = key.split('.');
//
//			let currentConfig = this._config;
//			for (let key of keys) {
//				if(!currentConfig[key]){
//					constructedConfig[key] = {};
//					currentConfig[key] = {};
//				}
//
//
//			}
//		}
//
//		constructedConfig[key] = value;
//
//		const configToSet = {...dotnotate(constructedConfig), ...constructedConfig};
//
//		this._config = {...this._config, ...configToSet};
	}

	/**
	 * If the target is an array, then we'll push it to the array
	 *
	 * @param key
	 * @param value
	 */
	put(key: string, value: any) {
		const current = this.get(key);

		if (!current) {
			this.set(key, [value]);

			return;
		}

		if (!(Array.isArray(current))) {
			throw new Error('ConfigRepository: Target ' + key + ' is not an array');
		}

		current.push(value);

		this.set(key, current);
	}

	/**
	 * Does a key exist in the Config?
	 *
	 * @param key
	 */
	has(key: string): boolean {
		return has(this._config, key);
//		return !!this._config[key];
	}

	reset() {
		this._config = {};
	}
}
