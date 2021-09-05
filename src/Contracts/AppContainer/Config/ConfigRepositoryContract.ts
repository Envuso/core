import {Config, ConfigHelperKeys} from "../../../Meta/Configuration";

export interface ConfigRepositoryContract {
	_config: any;

	/**
	 * Load all available Configuration
	 *
	 * We'll pass the config in here via the object that is registered in the apps boot
	 * process. Previously it tried to import the file from the path path specified,
	 * this didn't work when compiled because it was /src/ not /dist/
	 *
	 * @private
	 */
	loadConfigFrom(config: any): void;

	/**
	 * Get a Config value by key
	 *
	 * @param key
	 * @param _default
	 */
	//get<T>(key: string, _default?: any): T;
	//	get<T extends keyof ConfigHelperKeys>(key: T|string, _default?: any): ConfigHelperKeys[T];
	//get<T>(key: string, _default?: any): T;
	get<T extends keyof (typeof Config)>(file: T): (typeof Config)[T];

	file<T extends keyof (typeof Config)>(file: T): (typeof Config)[T];

	/**
	 * Set a Config on the repository
	 *
	 * @param key
	 * @param value
	 */
	set(key: string, value: any): void;

	/**
	 * If the target is an array, then we'll push it to the array
	 *
	 * @param key
	 * @param value
	 */
	put(key: string, value: any): void;

	/**
	 * Does a key exist in the Config?
	 *
	 * @param key
	 */
	has(key: string): boolean;

	reset(): void;
}
