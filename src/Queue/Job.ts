import {classToPlain, plainToClass} from "class-transformer";
import {DataTransferObject} from "../Routing";
import {Classes, Exception} from "../Common";
import path from "path";
import {BaseQueueable} from "./Queueable";

export class Job<T extends DataTransferObject> implements BaseQueueable {

	handle(): Promise<void> {
		throw new Exception("Bruh, implement handle()");
	}

	serialize() {
		const {namespace} = Reflect.getMetadata("job", this.constructor);

		return JSON.stringify({
			t : `${namespace}:${this.constructor.name}`,
			d : classToPlain(this, {enableImplicitConversion : true}),
		});
	}

	public static deserialize(rawData: any) {
		return plainToClass(this, rawData, {enableImplicitConversion : true});
		// return new this(rawData);
	}
}

export function handler() {
	return function (method: any, method1: any, method2: any,) {

	};
}

export function job(constructor: Function) {
	const {file}    = Classes.getModulePathFromConstructor(constructor as any);
	const namespace = path.relative(process.cwd(), file);

	Reflect.defineMetadata("job", {
		namespace,
	}, constructor);
}
