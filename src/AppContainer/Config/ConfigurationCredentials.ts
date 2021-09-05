import Dict = NodeJS.Dict;

export class ConfigurationCredentials {

	private envValues: Dict<string>;

	constructor(env: any = null) {
		this.envValues = env;
	}

	get env() {
		return this.envValues;
	}

	get<T extends keyof this>(key: T, _default: any = null): this[T] {
		return this[key] ?? _default;
	}

	has<T extends keyof this>(key: T): boolean {
		return !!this[key];
	}

}
