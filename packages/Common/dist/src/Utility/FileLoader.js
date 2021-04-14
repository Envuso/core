"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLoader = void 0;
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
const Log_1 = require("../Logger/Log");
class FileLoader {
    /**
     * Check if we're currently running via ts-node or regular node
     *
     * Credits to ActionHero:
     * https://github.com/actionhero/actionhero/blob/master/src/classes/process/typescript.ts
     */
    static isTypescript() {
        const extension = path_1.default.extname(__filename);
        if (extension === ".ts") {
            return true;
        }
        // are we running via a ts-node/ts-node-dev shim?
        const lastArg = process.execArgv[process.execArgv.length - 1];
        if (lastArg && path_1.default.parse(lastArg).name.indexOf("ts-node") >= 0) {
            return true;
        }
        try {
            /**
             * Are we running in typescript at the moment?
             * see https://github.com/TypeStrong/ts-node/pull/858 for more details
             */
            return process[Symbol.for("ts-node.register.instance")];
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    /**
     * Will give an array of files at the path
     *
     * @param path
     */
    static filesInPath(path) {
        return glob_1.glob.sync(path, { follow: true });
    }
    /**
     * Get the name and class instance of a module from import()
     *
     * @param module
     */
    static moduleInformation(module) {
        const moduleInstanceKey = Object.keys(module).shift() || null;
        if (!moduleInstanceKey) {
            throw new Error('There was an error loading the module from classAndNameFromModule path: ' + module);
        }
        const instance = module[moduleInstanceKey];
        const name = instance.name;
        return { instance, name };
    }
    /**
     * Normalize our path so that it's absolute and runs from the processes root dir
     *
     * @param pathToNormalize
     */
    static normalizePath(pathToNormalize) {
        return path_1.default.isAbsolute(pathToNormalize)
            ? path_1.default.normalize(pathToNormalize)
            : path_1.default.join(process.cwd(), pathToNormalize);
    }
    /**
     * When we're running with ts-node,
     * we want to use .ts extensions and resolve files from /src/
     *
     * When we've compiled and are running via node /dist/main.js for ex
     * We want to use .js extensions and resolve files from /dist/
     *
     * @param pathToFormat
     * @param extensions
     */
    static formatPathForRunEnvironment(pathToFormat, extensions = { forTsNode: 'ts', forNode: 'js' }) {
        const isTS = this.isTypescript();
        pathToFormat = this.normalizePath(pathToFormat);
        const pathInformation = path_1.default.parse(pathToFormat);
        pathInformation.ext = isTS ? extensions.forTsNode : extensions.forNode;
        if (!isTS && pathInformation.dir.includes('/src/')) {
            pathInformation.dir = pathInformation.dir.replace('/src/', '/dist/');
        }
        return path_1.default.format(pathInformation);
    }
    /**
     * Import modules from the specified path and attempt
     * to convert them to the correct run environments
     * @param path
     */
    static importModulesFrom(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.filesInPath(path);
            const modules = [];
            for (let path of files) {
                const pathForEnv = this.formatPathForRunEnvironment(path);
                try {
                    const module = yield Promise.resolve().then(() => __importStar(require(pathForEnv)));
                    const { instance, name } = this.moduleInformation(module);
                    modules.push({
                        instance: instance,
                        name: name,
                        originalPath: path,
                        forRunEnvironment: pathForEnv
                    });
                }
                catch (error) {
                    Log_1.Log.error(error.toString(), { error: error });
                }
            }
            return modules;
        });
    }
}
exports.FileLoader = FileLoader;
//# sourceMappingURL=FileLoader.js.map