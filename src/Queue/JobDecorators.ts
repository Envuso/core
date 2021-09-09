import {Classes} from "../Common";
import path from "path";

export function job(constructor: Function) {
	const {file} = Classes.getModulePathFromConstructor(constructor as any);
	const namespace = path.relative(process.cwd(), file);

	Reflect.defineMetadata("job", {
		namespace,
	}, constructor);
}
