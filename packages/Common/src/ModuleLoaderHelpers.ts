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

	const controller = module[moduleInstanceKey];
	const name       = controller.name;

	return {controller, name}
}
