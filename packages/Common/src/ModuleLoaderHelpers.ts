import {glob} from "glob";

export const loadModulesFromPath = (path) => {
	return glob.sync(
		path, {follow : true}
	);
};

export const classAndNameFromModule = (module) => {
	const moduleInstanceKey = Object.keys(module).shift() || null;

	if (!moduleInstanceKey) {
		throw new Error('There was an error loading the module from classAndNameFromModule path: ' + module);
	}

	const instance = module[moduleInstanceKey];
	const name     = instance.name;

	return {instance, name}
}
