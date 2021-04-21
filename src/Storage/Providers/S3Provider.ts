import {S3} from "aws-sdk";
import {DeleteObjectOutput} from "aws-sdk/clients/s3";
import fs from "fs";
import {Str} from "../../Common";
import {S3Config, StorageConfig} from "../../Config/Storage";
import {StorageProviderContract, StoragePutOptions, UploadedFileInformation} from "../StorageProviderContract";

export class S3Provider extends StorageProviderContract {
	private s3: S3;
	private _config: S3Config = null;

	constructor(config: StorageConfig) {
		super();

		this._config = config.s3;

		this.s3 = new S3(config.s3);
	}

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 */
	public files(directory: string) {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.s3.listObjectsV2({
				Bucket : this._config.bucket,
				Prefix : directory
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data);
			})
		});
	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public directories(directory: string): Promise<string[]> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.s3.listObjectsV2({
				Bucket    : this._config.bucket,
				Delimiter : directory,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data.CommonPrefixes.map(d => d.Prefix));
			})
		});
	}

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	public makeDirectory(directory: string): Promise<boolean> {

		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.s3.putObject({
				Bucket : this._config.bucket,
				Key    : directory,
				Body   : '',
				ACL    : 'public-read',
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(!!data.ETag);
			})
		});
	}

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	public deleteDirectory(directory: string): Promise<DeleteObjectOutput> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.s3.deleteObject({
				Bucket : this._config.bucket,
				Key    : directory,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data);
			})
		});
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public fileExists(key: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.s3.headObject({
				Bucket : this._config.bucket,
				Key    : key,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(!!data.ContentLength);
			})
		});
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public get(location: string) {
		return new Promise((resolve, reject) => {
			this.s3.getObject({
				Bucket : this._config.bucket,
				Key    : location,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(Buffer.from(data.Body as Buffer).toString());
			})
		});
	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation> {
		return new Promise((resolve, reject) => {
			const extension = file.filename.split(".").pop();
			const newName   = Str.random() + "." + extension;
			const fileKey   = location + "/" + (file.storeAs ? file.storeAs : newName);

			this.s3.putObject({
				ACL    : "public-read",
				Bucket : this._config.bucket,
				Key    : fileKey,
				Body   : fs.createReadStream(file.tempFilePath)
			}, (error) => {
				if (error) {
					return reject(error);
				}
				resolve(<UploadedFileInformation>{
					url          : `${this._config.url}/${fileKey}`,
					path         : fileKey,
					originalName : file.filename
				});
			});
		})
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public remove(location: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.s3.deleteObject({
				Bucket : this._config.bucket,
				Key    : location,
			}, (error) => {
				if (error) {
					return reject(error);
				}

				resolve(true);
			})
		});
	}

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	public url(location: string) {
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
	public temporaryUrl(location: string, expiresInSeconds: number) {
		return this.s3.getSignedUrlPromise("getObject", {
			Bucket  : this._config.bucket,
			Key     : location,
			Expires : expiresInSeconds
		});
	}
}
