"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Provider = void 0;
const Str_1 = require("@envuso/common/dist/src/Utility/Str");
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const StorageProviderContract_1 = require("../StorageProviderContract");
class S3Provider extends StorageProviderContract_1.StorageProviderContract {
    constructor(config) {
        super();
        this._config = null;
        this._config = config.s3;
        this.s3 = new aws_sdk_1.S3(config.s3);
    }
    /**
     * Get the files from the target directory
     *
     * @param directory
     */
    files(directory) {
        if (!directory.endsWith('/')) {
            directory += '/';
        }
        return new Promise((resolve, reject) => {
            this.s3.listObjectsV2({
                Bucket: this._config.bucket,
                Prefix: directory
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    directories(directory) {
        if (!directory.endsWith('/')) {
            directory += '/';
        }
        return new Promise((resolve, reject) => {
            this.s3.listObjectsV2({
                Bucket: this._config.bucket,
                Delimiter: directory,
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data.CommonPrefixes.map(d => d.Prefix));
            });
        });
    }
    /**
     * Create a new directory
     *
     * @param directory
     */
    makeDirectory(directory) {
        if (!directory.endsWith('/')) {
            directory += '/';
        }
        return new Promise((resolve, reject) => {
            this.s3.putObject({
                Bucket: this._config.bucket,
                Key: directory,
                Body: '',
                ACL: 'public-read',
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(!!data.ETag);
            });
        });
    }
    /**
     * Delete a directory
     *
     * @param directory
     */
    deleteDirectory(directory) {
        if (!directory.endsWith('/')) {
            directory += '/';
        }
        return new Promise((resolve, reject) => {
            this.s3.deleteObject({
                Bucket: this._config.bucket,
                Key: directory,
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    fileExists(key) {
        return new Promise((resolve, reject) => {
            this.s3.headObject({
                Bucket: this._config.bucket,
                Key: key,
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(!!data.ContentLength);
            });
        });
    }
    /**
     * Get the contents of a file
     *
     * @param location
     */
    get(location) {
        return new Promise((resolve, reject) => {
            this.s3.getObject({
                Bucket: this._config.bucket,
                Key: location,
            }, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(Buffer.from(data.Body).toString());
            });
        });
    }
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    put(location, file) {
        return new Promise((resolve, reject) => {
            const extension = file.filename.split(".").pop();
            const newName = Str_1.Str.random() + "." + extension;
            const fileKey = location + "/" + (file.storeAs ? file.storeAs : newName);
            this.s3.putObject({
                ACL: "public-read",
                Bucket: this._config.bucket,
                Key: fileKey,
                Body: fs_1.default.createReadStream(file.tempFilePath)
            }, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    url: `${this._config.url}/${fileKey}`,
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
        return new Promise((resolve, reject) => {
            this.s3.deleteObject({
                Bucket: this._config.bucket,
                Key: location,
            }, (error) => {
                if (error) {
                    return reject(error);
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
        let path = this._config.url;
        if (location.startsWith('/')) {
            location = location.slice(1);
        }
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        return path + '/' + location;
    }
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    temporaryUrl(location, expiresInSeconds) {
        return this.s3.getSignedUrlPromise("getObject", {
            Bucket: this._config.bucket,
            Key: location,
            Expires: expiresInSeconds
        });
    }
}
exports.S3Provider = S3Provider;
//# sourceMappingURL=S3Provider.js.map