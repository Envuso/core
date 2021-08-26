import fs from "fs";
import {ConfigRepository, resolve} from "../AppContainer";
import {Str} from "../Common";
import {DiskConfiguration, DisksList, DriverTypes, StorageConfiguration} from "../Config/Storage";
import {StorageProviderContract, StoragePutOptions, UploadedFileInformation} from "./StorageProviderContract";
import path from "path";
import {pipeline} from "stream";
import * as util from 'util';

const pump = util.promisify(pipeline);

export class Storage {

	private _config: StorageConfiguration;
	private _provider: StorageProviderContract;
	private _disk: DiskConfiguration<any>;

	constructor(storageConfig: StorageConfiguration) {
		this._config = storageConfig;

		this._disk = storageConfig.disks[storageConfig.defaultDisk];

		this._provider = new storageConfig.drivers[this._disk.driver](this._disk);

		if (!(this._provider instanceof StorageProviderContract)) {
			throw new Error('Your storage provider is not an instance of StorageProviderContract');
		}
	}

	/**
	 * Get an instance of x storage provider that is using x disk configuration
	 * This allows us to map multiple local/remote locations/credentials to use
	 * and switch between on the fly when it's needed.
	 *
	 * @param {string} disk
	 * @returns {StorageProviderContract}
	 */
	static disk<T extends keyof DriverTypes, K extends keyof DisksList>(disk: K): StorageProviderContract {
		const config = resolve(ConfigRepository).get<StorageConfiguration>('storage');

		const selectedDisk = config.disks[disk] as DiskConfiguration<T>;

		if (!selectedDisk) {
			throw new Error('You specified an invalid disk: ' + disk);
		}

		const driver = config.drivers[selectedDisk.driver] as new (storageConfig: DiskConfiguration<T>) => StorageProviderContract;

		if (!driver) {
			throw new Error('You specified an invalid driver for this disk: ' + selectedDisk.driver);
		}

		return new driver(selectedDisk);
	}

	//	/**
	//	 * Use storage with a different provider
	//	 *
	//	 * Allows us to set our default as S3 for example, then use disk for other things.
	//	 *
	//	 * @param provider
	//	 */
	//	static provider(provider: new (storageConfig: StorageConfiguration) => StorageProviderContract) {
	//		const storageConfig = resolve(ConfigRepository).get<StorageConfiguration>('storage');
	//
	//		return new provider(storageConfig);
	//	}

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
	 * @param recursive
	 */
	public static files(directory: string, recursive: boolean = false): Promise<string[]> {
		return this.getAdapter().files(directory, recursive);
	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public static directories(directory: string): Promise<string[]> {
		return this.getAdapter().directories(directory);
	}

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	public static makeDirectory(directory: string): Promise<boolean> {
		return this.getAdapter().makeDirectory(directory);
	}

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	public static deleteDirectory(directory: string): Promise<boolean> {
		return this.getAdapter().deleteDirectory(directory);
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public static fileExists(key: string): Promise<boolean> {
		return this.getAdapter().fileExists(key);
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public static get(location: string): Promise<string> {
		return this.getAdapter().get(location);
	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public static put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation> {
		return this.getAdapter().put(location, file);
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public static remove(location: string): Promise<boolean> {
		return this.getAdapter().remove(location);
	}

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	public static url(location: string): string {
		return this.getAdapter().url(location);
	}

	/**
	 * Get a temporary url for the file
	 * (only works if it's an S3 based provider)
	 *
	 * @param location
	 * @param expiresInSeconds
	 */
	public static temporaryUrl(location: string, expiresInSeconds: number): Promise<string> {
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
	public static async saveTemporaryFile(fileName: string, stream: NodeJS.ReadableStream): Promise<string> {
		const tempPath = resolve(ConfigRepository).get<string>('paths.temp');

		await Storage.disk('temp').makeDirectory(path.join('storage', 'temp'));

		const tempName = Str.random() + '.' + (fileName.split('.').pop());

		await pump(stream, fs.createWriteStream(path.join(tempPath, tempName)));

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
