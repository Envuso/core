"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileProvider = void 0;
const path_1 = __importDefault(require("path"));
const Common_1 = require("../../Common");
const fs_1 = __importDefault(require("fs"));
const StorageProviderContract_1 = require("../StorageProviderContract");
class LocalFileProvider extends StorageProviderContract_1.StorageProviderContract {
    constructor(config) {
        var _a;
        super();
        this.basePath = (_a = config.root) !== null && _a !== void 0 ? _a : '';
    }
    /**
     * Get the files from the target directory
     *
     * @param directory
     * @param recursive
     */
    files(directory, recursive = false) {
        directory = this.formatPath(directory);
        return new Promise((resolve, reject) => {
            const listFiles = (dirName, files_) => {
                files_ = files_ || [];
                let files = fs_1.default.readdirSync(dirName);
                for (let i in files) {
                    const name = dirName + '/' + files[i];
                    const isDirectory = fs_1.default.statSync(name).isDirectory();
                    if (isDirectory && !recursive) {
                        continue;
                    }
                    if (isDirectory && recursive) {
                        listFiles(name, files_);
                    }
                    if (!isDirectory) {
                        files_.push(name);
                    }
                }
                return files_;
            };
            resolve(listFiles(directory).map(name => name.replace(directory + '/', '').replace(directory, '')));
        });
    }
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    directories(directory) {
        directory = this.formatPath(directory);
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
        directory = this.formatPath(directory);
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(directory)) {
                fs_1.default.mkdirSync(directory, { recursive: true });
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
        directory = this.formatPath(directory);
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(directory)) {
                return resolve(true);
            }
            fs_1.default.rmSync(directory, { recursive: true });
            resolve(fs_1.default.existsSync(directory) === false);
        });
    }
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    fileExists(key) {
        key = this.formatPath(key);
        return new Promise((resolve, reject) => {
            const stat = fs_1.default.statSync(key);
            if (!stat) {
                resolve(false);
            }
            resolve(stat.isFile());
        });
    }
    /**
     * Get the contents of a file
     *
     * @param location
     */
    get(location) {
        location = this.formatPath(location);
        return new Promise((resolve, reject) => {
            resolve(fs_1.default.readFileSync(location, { encoding: 'utf-8' }));
        });
    }
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    put(location, file) {
        location = this.formatPath(location);
        return new Promise((resolve, reject) => {
            const extension = file.filename.split(".").pop();
            const newName = Common_1.Str.random() + "." + extension;
            const fileKey = path_1.default.join(location, (file.storeAs ? file.storeAs : newName));
            const writeStream = fs_1.default.createWriteStream(fileKey);
            const readStream = fs_1.default.createReadStream(file.tempFilePath);
            readStream.on('open', function () {
                readStream.pipe(writeStream);
            });
            readStream.on('error', function (err) {
                reject(err);
            });
            readStream.on('end', () => {
                resolve({
                    url: null,
                    path: fileKey,
                    originalName: file.filename
                });
            });
        });
    }
    /**
     * Delete a file
     *
     * @param location
     */
    remove(location) {
        location = this.formatPath(location);
        return new Promise((resolve, reject) => {
            fs_1.default.rm(location, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
    /**
     * Get the url for the file
     *
     * @param location
     */
    url(location) {
        return null;
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
    formatPath(definedPath) {
        return path_1.default.resolve(path_1.default.join(this.basePath, definedPath));
    }
}
exports.LocalFileProvider = LocalFileProvider;
//# sourceMappingURL=LocalFileProvider.js.map