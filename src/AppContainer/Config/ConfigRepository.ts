import get from "lodash.get";
import has from "lodash.has";
import set from "lodash.set";
import {injectable} from "tsyringe";
import {ConfigRepositoryContract} from "../../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Config, ConfigHelperKeys} from "../../Meta/Configuration";

//const {Config, ConfigHelperKeys} = require("../../Meta/Configuration");

@injectable()
export class ConfigRepository implements ConfigRepositoryContract {

	/**
	 * All of the Config loaded into the repository
	 *
	 * @private
	 */
	public _config: any;

	/**
	 * Load all available Configuration
	 *
	 * We'll pass the config in here via the object that is registered in the apps boot
	 * process. Previously it tried to import the file from the path path specified,
	 * this didn't work when compiled because it was /src/ not /dist/
	 *
	 * @private
	 */
	public loadConfigFrom(config: any) {
		this._config = config;
	}

	/**
	 * Get a Config value by key
	 *
	 * @param file
	 */
	//	public get<T>(key: string, _default?: any): T;
	//	public get<T extends keyof ConfigHelperKeys>(key: T, _default?: any): T extends keyof ConfigHelperKeys ? ConfigHelperKeys[T] : T;
	//	public get<T extends (keyof ConfigHelperKeys | string)>(key: T | string, _default: any = null): T extends keyof ConfigHelperKeys ? ConfigHelperKeys[T] : T {
	public get<T extends keyof (typeof Config)>(file: T): (typeof Config)[T] {
		//		return get(this._config, key, _default);
		//return this._config[key] as T ?? _default;
		return this.file(file);
	}

	/**
	 * Get a config file
	 *
	 * @param {T} file
	 * @return {typeof Config[T]}
	 */
	public file<T extends keyof (typeof Config)>(file: T): (typeof Config)[T] {
		return Config[file];
	};

	//	function config<T extends keyof ConfigHelperKeys>(key?: T): ConfigHelperKeys[T] {
	//		return get(Config, key);
	//	}
	//
	//	const session = config("Session");

	/**
	 * Set a Config on the repository
	 *
	 * @param key
	 * @param value
	 */
	public set(key: string, value: any) {
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
	public put(key: string, value: any) {
		//@ts-ignore
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
	public has(key: string): boolean {
		return has(this._config, key);
		//		return !!this._config[key];
	}

	public reset() {
		this._config = {};
	}
}
