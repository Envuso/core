import path from "path";
import {Classes} from "../../Common/Utility/Classes";

/**
 * Marks a class as a queueable Job. The worker thread loads the Job again from
 * the file it was declared in, so that path (relative to cwd) is stored with it.
 */
export function job(constructor: Function) {
	const file      = declaringFile();
	const namespace = path.relative(process.cwd(), file);

	Reflect.defineMetadata("job", {
		namespace,
	}, constructor);
}

/**
 * The first stack frame that's real source code outside this file and node_modules:
 * the module whose top level is running this decorator.
 */
function declaringFile(): string {
	const frame = Classes.getCallsites().find(site => {
		const file = site.getFileName();

		return !!file
			&& path.isAbsolute(file)
			&& path.resolve(file) !== path.resolve(__filename)
			&& !file.includes(`${path.sep}node_modules${path.sep}`)
			&& !file.includes('/node_modules/');
	});

	if (!frame) {
		throw new Error('@job could not work out which file the Job is declared in');
	}

	return frame.getFileName();
}
