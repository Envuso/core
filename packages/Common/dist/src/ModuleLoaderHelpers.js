"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classAndNameFromModule = exports.loadModulesFromPath = void 0;
const glob_1 = require("glob");
const loadModulesFromPath = (path) => {
    return glob_1.glob.sync(path, { follow: true });
};
exports.loadModulesFromPath = loadModulesFromPath;
const classAndNameFromModule = (module) => {
    const moduleInstanceKey = Object.keys(module).shift() || null;
    if (!moduleInstanceKey) {
        throw new Error('There was an error loading the module from classAndNameFromModule path: ' + module);
    }
    const controller = module[moduleInstanceKey];
    const name = controller.name;
    return { controller, name };
};
exports.classAndNameFromModule = classAndNameFromModule;
//# sourceMappingURL=ModuleLoaderHelpers.js.map