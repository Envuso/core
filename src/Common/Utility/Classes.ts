import {CallSite} from "./Classes.types";
import Constructable = jest.Constructable;

type Constructor<T = {}> = new (...args: any[]) => T;

export interface FrameworkModule {
	filePath: string;
	directory: string;
	id: string;
	exportNames: string[];
	exports: { [key: string]: (new (...args: any[]) => any | Function) };
}

export class Classes {

	/**
	 * Check if a class has been instantiated
	 *
	 * @param c
	 * @returns {boolean}
	 */
	public static isInstantiated(c: any): boolean {
		return (typeof c.prototype === "undefined");
	}

	/**
	 * Hacky dirty way to check if our class extends another specific class
	 * without referencing it or using instanceof checks
	 *
	 * @param classInstance
	 * @param {string} name
	 * @param {number} maxLookLevels
	 * @returns {boolean}
	 */
	public static checkIfExtends(classInstance: any, name: string, maxLookLevels: number = 3) {
		const levels = [
			classInstance.__proto__
		];

		for (let i = 0; i < maxLookLevels; i++) {
			levels.push(levels[i]?.__proto__);

			if (!levels[i]) {
				continue;
			}

			if (levels[i]?.name === name) {
				return true;
			}
		}

		return false;
	}

	/**
	 * If a class has been instantiated, get the underlying constructor
	 * Otherwise, return the constructor
	 *
	 * @param c
	 * @returns {boolean}
	 */
	public static getConstructor<T>(c: any): new () => T {
		if (this.isInstantiated(c)) {
			return c.constructor;
		}

		return c;
	}

	/**
	 * Get the constructor name from the constructor
	 *
	 * Returns null if not a constructor
	 *
	 * @param c
	 * @returns {string | null}
	 */
	public static getConstructorName(c: any): string | null {
		return this.getConstructor(c)?.name ?? null;
	}

	/**
	 * @Credit: https://github.com/sindresorhus/callsites/blob/main/index.js
	 *
	 * @return {string}
	 */
	public static getCallsites(): CallSite[] {
		const _prepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace  = (_, stack) => stack;
		const stack              = new Error().stack.slice(1);
		Error.prepareStackTrace  = _prepareStackTrace;
		//@ts-ignore
		return stack;
	}

	/**
	 * Returns information on where the module was loaded from
	 * (this has to be called inside the module we want this information from)
	 *
	 * @Credit: https://github.com/sindresorhus/caller-callsite
	 *
	 * @param {number} depth
	 * @return {CallSite}
	 */
	public static getCallerCallsites(depth?: number): CallSite {

		const callers       = [];
		const callerFileSet = new Set();

		const callSites = this.getCallsites();
		const fileNames = this.getCallsites().map(f => f.getFileName());

		for (const callsite of callSites) {
			const fileName    = callsite.getFileName();
			const hasReceiver = callsite.getTypeName() !== null && fileName !== null;

			if (!callerFileSet.has(fileName)) {
				callerFileSet.add(fileName);
				callers.unshift(callsite);
			}

			if (hasReceiver) {
				return callers[depth];
			}
		}
	}

	public static getFrameworkModules(): { [key: string]: FrameworkModule } {
		const cache = require.cache;

		const projModules: { [key: string]: FrameworkModule } = {};

		for (let cacheKey in cache) {
			if (cacheKey.includes('node_modules') || !cacheKey.includes(process.cwd())) {
				continue;
			}

			const m = cache[cacheKey];

			projModules[cacheKey] = <FrameworkModule>{
				filePath    : m.filename,
				directory   : m.path,
				id          : m.id,
				exportNames : Object.keys(m.exports),
				exports     : m.exports,
			};
		}

		return projModules;
	}

	public static getModulePathFromConstructor(cstr: new () => any) {
		const callSites     = this.getCallsites();
		const callSitePaths = this.getCallsites().map(f => f.getFileName());

		const result = callSites.find(c => {
			return c.getFileName().includes(cstr.name);
		});

		return {
			file          : result.getFileName(),
			isConstructor : result.isConstructor()
		};
	}

}
