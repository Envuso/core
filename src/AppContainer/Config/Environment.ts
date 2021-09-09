import {config} from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import {Obj} from "../../Common";

export default class Environment {

	private static environment: { [key: string]: any } = {};

	/**
	 * Check if we're running in development mode.
	 *
	 * @return {boolean}
	 */
	public static isDevelopment(): boolean {
		return this.isDev();
	}

	/**
	 * Check if we're running in development mode.
	 *
	 * @return {boolean}
	 */
	public static isDev(): boolean {
		return this.environment.NODE_ENV === 'development';
	}

	/**
	 * Check if we're running in production mode.
	 *
	 * @return {boolean}
	 */
	public static isProduction(): boolean {
		return this.isProd();
	}

	/**
	 * Check if we're running in production mode.
	 *
	 * @return {boolean}
	 */
	public static isProd(): boolean {
		return this.environment.NODE_ENV === 'production';
	}

	/**
	 * Check if we're running in some other environment
	 *
	 * @param {string} env
	 * @return {boolean}
	 */
	public static is(env: string): boolean {
		return this.environment.NODE_ENV === env;
	}

	/**
	 * Get the NODE_ENV string
	 *
	 * @return {string}
	 */
	public static getEnv(): string {
		return this.environment.NODE_ENV;
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 *
	 * @returns {boolean}
	 */
	static isNode(): boolean {
		return (typeof process !== undefined &&
			typeof process.versions !== undefined &&
			typeof process.versions.node !== undefined);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 *
	 * @returns {boolean}
	 */
	static isBrowser(): boolean {
		try {
			// @ts-ignore
			return (window !== undefined);
		} catch (error) {
		}

		return false;
	}

	/**
	 * Load the environment file
	 * Will load from the project root by default
	 * You can specify a different path also; path.join('..', '..', '.env') for example.
	 *
	 * @param {string} envFileLocation
	 */
	public static load(envFileLocation?: string) {
		let envConfig = envFileLocation ? config({path : envFileLocation}) : config();

		envConfig = dotenvExpand(envConfig);

		if (envConfig?.parsed?.NODE_ENV === undefined) {
			this.environment.NODE_ENV = 'development';
		}

		this.environment = JSON.parse(JSON.stringify(envConfig.parsed));
		for (let key in this.environment) {
			if (this.environment[key] === '') {
				this.environment[key] = null;

				continue;
			}

			if (Obj.isNumber(this.environment[key])) {
				this.environment[key] = Number(this.environment[key]);

				continue;
			}

			if (Obj.isBoolean(this.environment[key])) {
				this.environment[key] = Boolean(this.environment[key]);
			}
		}

		return this.environment;
	}

	/**
	 * Get a value from the environment
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public static get<T>(key: string, _default: any = null): T {
		return this.environment[key] ?? _default;
	}

	/**
	 * Check if a value exists in the environment
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public static has(key: string): boolean {
		return (this.environment[key] ?? undefined) !== undefined;
	}
}
