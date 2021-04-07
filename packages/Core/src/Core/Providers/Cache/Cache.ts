import {inject, injectable} from "inversify";
import {init, set, get, del} from "node-cache-redis";


@injectable()
export class Cache {

	async get(key: string, defaultValue = null) {
		const value = await get(key);
		return value ?? defaultValue;
	}

	async put(key: string, value: any, ttl?: number) {
		await set(key, value, ttl);
	}

	async remove(key: string) {
		await del([key]);
	}

	async has(key : string){
		return !!(await this.get(key, undefined));
	}

}
