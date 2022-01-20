import {config} from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from "path";
import {Log, Obj} from "../../Common";
import * as fs from 'fs-extra';

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
	 * Contributed by https://github.com/Tecnology73
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
	 * Contributed by https://github.com/Tecnology73
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

	private static envPath(envFileLocation?: string) {
		const cwd = process.cwd();

		if (envFileLocation.startsWith(cwd)) {
			return envFileLocation;
		}

		return path.join(process.cwd(), envFileLocation);
	}

	public static hasEnvFile(envFileLocation?: string) {
		try {
			const stat = fs.statSync(this.envPath(envFileLocation));

			return !!stat?.isFile();
		} catch (error) {
			return false;
		}
	}

	public static loadEnvFile(envFileLocation?: string): [boolean, any] {

		if (!this.hasEnvFile(envFileLocation)) {
			Log.label('ENVIRONMENT').warn(`No .env file can be found at ${this.envPath(envFileLocation)}`);
			Log.label('ENVIRONMENT').warn(`Since we cannot access the .env file in this environment. We'll now parse the node.js "process.env" object.`);
			return [false, null];
		}

		let envConfig = envFileLocation ? config({path : envFileLocation}) : config();

		if (envConfig?.error) {
			Log.label('ENVIRONMENT').exception(envConfig.error);

			return [false, null];
		}

		envConfig = dotenvExpand(envConfig);

		return [true, (envConfig.parsed || {})];
	}

	private static parseEnvObject(env: any) {
		const newEnv = JSON.parse(JSON.stringify((env || {})));

		for (let key in newEnv) {
			if (newEnv[key] === '') {
				newEnv[key] = null;

				continue;
			}

			if (Obj.isBoolean(newEnv[key])) {
				newEnv[key] = Boolean(newEnv[key]);
			}

			if (Obj.isNumber(newEnv[key])) {
				newEnv[key] = Number(newEnv[key]);
			}

		}

		return newEnv;
	}

	/**
	 * Load the environment file
	 * Will load from the project root by default
	 * You can specify a different path also; path.join('..', '..', '.env') for example.
	 *
	 * @param {string} envFileLocation
	 */
	public static load(envFileLocation?: string) {
		this.environment = this.parseEnvObject(process.env);

		const [canLoadEnvFile, envData] = this.loadEnvFile(envFileLocation);
		if (canLoadEnvFile) {
			this.environment = {...this.environment, ...this.parseEnvObject(envData)};
		}

		if (this.environment?.NODE_ENV === undefined) {
			this.environment.NODE_ENV = 'development';
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
