import {DataTransferObject} from "../Routing";
import {Classes, Exception} from "../Common";
import path from "path";
import {BaseQueueable} from "./Queueable";

export class Job<T extends DataTransferObject> implements BaseQueueable {
	public data: T = null;

	constructor(data: T) {
		this.data = data;
	}

	handle(): Promise<void> {
		throw new Exception("Bruh, implement handle()");
	}

	serialize() {
		const {namespace} = Reflect.getMetadata("job", this.constructor);

		return JSON.stringify({
			t: `${namespace}:${this.constructor.name}`,
			d: this.data.toResponse(),
		});
	}

	public static deserialize(rawData: string) {
		// return new this(rawData);
	}
}

export function job(constructor: Function) {
	const {file} = Classes.getModulePathFromConstructor(constructor as any);
	const namespace = path.relative(process.cwd(), file);

	Reflect.defineMetadata("job", {
		namespace,
	}, constructor);
}
