
export class ConfigurationCredentials {

	get<T extends keyof this>(key: T, _default: any = null): this[T] {
		return this[key] ?? _default;
	}

	has<T extends keyof this>(key: T): boolean {
		return !!this[key];
	}

}
