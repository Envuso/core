import {Config} from "@Config";
import {S3} from "aws-sdk";
import {DeleteObjectOutput, PutObjectOutput} from "aws-sdk/clients/s3";
import {Multipart} from "fastify-multipart";
import * as fs from "fs";
import {injectable} from "inversify";
import {Encryption, StorageProvider, UploadedFileInformation} from "@Core";
import {pipeline} from "stream";
import * as util from 'util'

const pump = util.promisify(pipeline)

@injectable()
export class SpacesProvider extends StorageProvider {
	private spaces: S3;

	constructor() {
		super();

		this.spaces = new S3(Config.storage.spaces);
	}

	public files(directory: string) {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.spaces.listObjectsV2({
				Bucket : Config.storage.spaces.bucket,
				//Delimiter : '/',
				Prefix : directory
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data);
			})
		});
	}

	public directories(directory: string): Promise<string[]> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.spaces.listObjectsV2({
				Bucket    : Config.storage.spaces.bucket,
				Delimiter : directory,
//				Prefix : directory
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data.CommonPrefixes.map(d => d.Prefix));
			})
		});
	}

	public makeDirectory(directory: string): Promise<boolean> {

		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.spaces.putObject({
				Bucket : Config.storage.spaces.bucket,
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

	public deleteDirectory(directory: string): Promise<DeleteObjectOutput> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		return new Promise((resolve, reject) => {
			this.spaces.deleteObject({
				Bucket : Config.storage.spaces.bucket,
				Key    : directory,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data);
			})
		});
	}

	public fileExists(key: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.spaces.headObject({
				Bucket : Config.storage.spaces.bucket,
				Key    : key,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(!!data.ContentLength);
			})
		});
	}

	public get(location: string) {
		return new Promise((resolve, reject) => {
			this.spaces.getObject({
				Bucket : Config.storage.spaces.bucket,
				Key    : location,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(Buffer.from(data.Body as Buffer).toString());
			})
		});
	}


	public put(location: string, file: Pick<Multipart, "filepath" | "filename"> & { storeAs?: string }): Promise<UploadedFileInformation> {
		return new Promise((resolve, reject) => {
			const extension  = file.filename.split(".").pop();
			const newName    = Encryption.random() + "." + extension;
			const fileStream = fs.createReadStream(file.filepath);
			const fileKey    = location + "/" + (file.storeAs ? file.storeAs : newName);

			this.spaces.putObject({
				ACL    : "public-read",
				Bucket : Config.storage.spaces.bucket,
				Key    : fileKey,
				Body   : fileStream
			}, (error, data: PutObjectOutput) => {
				if (error) {
					return reject(error);
				}
				resolve(<UploadedFileInformation>{
					url          : `${Config.storage.spaces.url}/${fileKey}`,
					path         : fileKey,
					originalName : file.filename
				});
			});
		})
	}

	public remove(location: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.spaces.deleteObject({
				Bucket : Config.storage.spaces.bucket,
				Key    : location,
			}, (error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(true);
			})
		});
	}

	public url(location: string) {
		let path = Config.storage.spaces.url;

		if (location.startsWith('/')) {
			location = location.slice(1);
		}
		if (path.endsWith('/')) {
			path = path.slice(0, -1);
		}

		return path + '/' + location;
	}

	public temporaryUrl(location: string, expiresInSeconds: number) {
		return this.spaces.getSignedUrlPromise("getObject", {
			Bucket  : Config.storage.spaces.bucket,
			Key     : location,
			Expires : expiresInSeconds
		});
	}

}
