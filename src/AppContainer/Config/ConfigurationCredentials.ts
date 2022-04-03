import Environment from "./Environment";

export class ConfigurationCredentials {

	/**
	 * Get a configuration value by key
	 *
	 * @param {T} key
	 * @param _default
	 * @returns {this[T]}
	 */
	get<T extends keyof this>(key: T, _default: any = null): this[T] {
		return this[key] ?? _default;
	}

	/**
	 * Check if a configuration value exists by key
	 *
	 * @param {T} key
	 * @returns {boolean}
	 */
	has<T extends keyof this>(key: T): boolean {
		return !!this[key];
	}

	env<T extends string>(key: string, _default: T = null): T {
		return Environment.get<T>(key, _default);
	}

}
