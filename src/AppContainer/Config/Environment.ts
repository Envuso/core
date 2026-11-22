import path from "path";
import {Log} from "../../Common/Logger/Log";

/**
 * Bun loads `.env` files itself before any code runs, in increasing precedence:
 * `.env`, `.env.{NODE_ENV}`, `.env.local` (skipped when NODE_ENV=test), `.env.{NODE_ENV}.local`.
 * Real environment variables win over all of them, and `${VAR}` references are expanded.
 * Use `bun --env-file=path/to/.env` for a different file, or `--no-env-file` to load none.
 *
 * This class only reads `process.env`, converting "" -> null and "true"/"false" -> booleans.
 */
export default class Environment {

	private static environment: { [key: string]: any } = null;

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
		return this.env().NODE_ENV === 'development';
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
		return this.env().NODE_ENV === 'production';
	}

	/**
	 * Check if we're running in some other environment
	 *
	 * @param {string} env
	 * @return {boolean}
	 */
	public static is(env: string): boolean {
		return this.env().NODE_ENV === env;
	}

	/**
	 * Get the NODE_ENV string
	 *
	 * @return {string}
	 */
	public static getEnv(): string {
		return this.env().NODE_ENV;
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

	private static parseEnvObject(env: any) {
		const newEnv: { [key: string]: any } = {};

		for (const key in (env || {})) {
			newEnv[key] = this.parseValue(env[key]);
		}

		return newEnv;
	}

	/**
	 * "" -> null and "true"/"false" -> boolean (case-insensitive).
	 * Numbers stay strings, like Laravel's env(): converting would silently turn
	 * numeric secrets (APP_KEY, passwords) into numbers. Use Number(...) where needed.
	 */
	private static parseValue(value: any): any {
		if (typeof value !== 'string') {
			return value;
		}

		const trimmed = value.trim();

		if (trimmed === '') {
			return null;
		}

		const lower = trimmed.toLowerCase();
		if (lower === 'true') {
			return true;
		}
		if (lower === 'false') {
			return false;
		}

		return value;
	}

	/**
	 * Read the environment (already populated by Bun from your .env files).
	 * Called automatically on first use; call it again after changing process.env.
	 *
	 * @param {string} envFileLocation Deprecated and ignored: use `bun --env-file=<path>`
	 */
	public static load(envFileLocation?: string) {
		if (envFileLocation && path.resolve(envFileLocation) !== path.resolve(process.cwd(), '.env')) {
			Log.label('ENVIRONMENT').warn(
				`Environment.load("${envFileLocation}") no longer loads files; Bun loads .env itself. ` +
				`Use "bun --env-file=${envFileLocation} ..." to load a different file.`
			);
		}

		this.environment = this.parseEnvObject(process.env);

		if (this.environment.NODE_ENV === undefined) {
			this.environment.NODE_ENV = 'development';
		}

		return this.environment;
	}

	private static env(): { [key: string]: any } {
		return this.environment ?? this.load();
	}

	/**
	 * Get a value from the environment
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public static get<T>(key: string, _default: any = null): T {
		return this.env()[key] ?? _default;
	}

	/**
	 * Check if a value exists in the environment
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public static has(key: string): boolean {
		return (this.env()[key] ?? undefined) !== undefined;
	}
}
