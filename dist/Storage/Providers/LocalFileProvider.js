"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileProvider = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const StorageProviderContract_1 = require("../StorageProviderContract");
class LocalFileProvider extends StorageProviderContract_1.StorageProviderContract {
    constructor(config) {
        super();
    }
    /**
     * Get the files from the target directory
     *
     * @param directory
     */
    files(directory) {
    }
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    directories(directory) {
        return new Promise((resolve, reject) => {
            fs_1.default.readdir(directory, {}, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
    /**
     * Create a new directory
     *
     * @param directory
     */
    makeDirectory(directory) {
        return new Promise((resolve, reject) => {
            const splitDirs = directory.split('/');
            const builtDir = [];
            for (let dir of splitDirs) {
                if (!fs_1.default.existsSync(path_1.default.join(...builtDir, dir))) {
                    fs_1.default.mkdirSync(path_1.default.join(...builtDir, dir));
                }
                builtDir.push(dir);
            }
            return resolve(fs_1.default.existsSync(directory));
        });
    }
    /**
     * Delete a directory
     *
     * @param directory
     */
    deleteDirectory(directory) {
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(directory)) {
                return resolve(true);
            }
            fs_1.default.rmdirSync(directory, { recursive: true });
            resolve(fs_1.default.existsSync(directory) === false);
        });
    }
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    fileExists(key) {
        return new Promise((resolve, reject) => {
        });
    }
    /**
     * Get the contents of a file
     *
     * @param location
     */
    get(location) {
    }
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    put(location, file) {
        return new Promise((resolve, reject) => {
        });
    }
    /**
     * Delete a file
     *
     * @param location
     */
    remove(location) {
        return new Promise((resolve, reject) => {
        });
    }
    /**
     * Get the url for the file
     *
     * @param location
     */
    url(location) {
    }
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    temporaryUrl(location, expiresInSeconds) {
        return null;
    }
}
exports.LocalFileProvider = LocalFileProvider;
//# sourceMappingURL=LocalFileProvider.js.map