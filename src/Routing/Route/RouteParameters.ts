export class RouteParameters {

	private params: any;

	constructor(params: any) {
		this.params = params;
	}

	get<T>(key: string, _default: any = null): T {
		return this.params[key] ?? _default;
	}

	set(key: string, value: any) {
		this.params[key] = value;
	}

	has(key: string): boolean {
		return !!this.params[key];
	}

	keys(): string[] {
		return Object.keys(this.params);
	}

	values<T extends any>(): T[] {
		return Object.values(this.params);
	}

	all() {
		return this.params;
	}

	forget(key: string) {
		delete this.params[key];
	}

	pull<T extends any>(key: string, _default: null = null): T {
		if (!this.has(key)) {
			return _default;
		}

		const value = this.get<T>(key, _default);

		this.forget(key);

		return value;
	}

}
