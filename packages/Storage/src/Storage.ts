import {ConfigRepository, resolve} from "@envuso/app";
import {Str} from "@envuso/common/dist/src/Utility/Str";
import fs from "fs";
import {StorageConfig} from "../Config/Storage";
import {StorageProviderContract, StoragePutOptions} from "./StorageProviderContract";
import path from "path";
import {pipeline} from "stream";
import * as util from 'util'

const pump = util.promisify(pipeline)

export class Storage {

	private _config: StorageConfig;
	private _provider: StorageProviderContract;

	constructor(storageConfig: StorageConfig) {
		this._config = storageConfig;

		this._provider = new storageConfig.defaultProvider(storageConfig);

		if (!(this._provider instanceof StorageProviderContract)) {
			throw new Error('Your storage provider is not an instance of StorageProviderContract');
		}
	}

	/**
	 * Use storage with a different provider
	 *
	 * Allows us to set our default as S3 for example, then use disk for other things.
	 *
	 * @param provider
	 */
	static provider(provider: new (storageConfig: StorageConfig) => StorageProviderContract) {
		const storageConfig = resolve(ConfigRepository).get<StorageConfig>('storage');

		return new provider(storageConfig);
	}

	/**
	 * Access the storage provider adapter statically
	 * This will resolve a new instance of the provider from the container
	 */
	static getAdapter<T extends StorageProviderContract>(): T {
		return resolve<Storage>(Storage).getProvider<T>();
	}

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 */
	public static files(directory: string) {
		return this.getAdapter().files(directory);
	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public static directories(directory: string) {
		return this.getAdapter().directories(directory);
	}

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	public static makeDirectory(directory: string) {
		return this.getAdapter().makeDirectory(directory);
	}

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	public static deleteDirectory(directory: string) {
		return this.getAdapter().deleteDirectory(directory);
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public static fileExists(key: string) {
		return this.getAdapter().fileExists(key);
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public static get(location: string) {
		return this.getAdapter().get(location);
	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public static put(location: string, file: StoragePutOptions) {
		return this.getAdapter().put(location, file);
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public static remove(location: string) {
		return this.getAdapter().remove(location);
	}

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	public static url(location: string) {
		return this.getAdapter().url(location);
	}

	/**
	 * Get a temporary url for the file
	 * (only works if it's an S3 based provider)
	 *
	 * @param location
	 * @param expiresInSeconds
	 */
	public static temporaryUrl(location: string, expiresInSeconds: number) {
		return this.getAdapter().temporaryUrl(location, expiresInSeconds);
	}

	/**
	 * When we have a file upload, we will pass the original file name
	 * to this method, along with it's stream. This method will store
	 * it in the storage's temp file directory and return it's name.
	 *
	 * @param fileName
	 * @param stream
	 */
	public static async saveTemporaryFile(fileName: string, stream: NodeJS.ReadStream) {
		const tempPath = resolve(ConfigRepository).get<string>('paths.temp');
		const tempName = Str.random() + '.' + (fileName.split('.').pop())

		await pump(stream, fs.createWriteStream(path.join(tempPath, tempName)))

		return tempName;
	}

	/**
	 * Return the adapter set on this instance
	 *
	 * @private
	 */
	private getProvider<T extends StorageProviderContract>(): T {
		return <T>this._provider;
	}
}
