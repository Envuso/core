import {DeleteObjectOutput} from "aws-sdk/clients/s3";
import path from "path";
import {StorageConfig} from "../../Config/Storage";
import fs, {BaseEncodingOptions, readdir} from 'fs';
import {StorageProviderContract, StoragePutOptions, UploadedFileInformation} from "../StorageProviderContract";

export class LocalFileProvider extends StorageProviderContract {

	constructor(config: StorageConfig) {
		super();
	}

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 */
	public files(directory: string) {

	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public directories(directory: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readdir(directory, {}, (error, result) => {
				if (error) {
					return reject(error);
				}

				resolve(result as string[]);
			});
		});
	}

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	public makeDirectory(directory: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const splitDirs = directory.split('/');
			const builtDir  = [];

			for (let dir of splitDirs) {
				if (!fs.existsSync(path.join(...builtDir, dir))) {
					fs.mkdirSync(path.join(...builtDir, dir));
				}

				builtDir.push(dir);
			}

			return resolve(fs.existsSync(directory));
		});
	}

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	public deleteDirectory(directory: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if(!fs.existsSync(directory)){
				return resolve(true)
			}

			fs.rmdirSync(directory, {recursive: true})

			resolve(fs.existsSync(directory) === false)
		});
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public fileExists(key: string): Promise<boolean> {
		return new Promise((resolve, reject) => {

		});
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public get(location: string) {

	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation> {

		return new Promise((resolve, reject) => {

		});
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public remove(location: string): Promise<boolean> {

		return new Promise((resolve, reject) => {

		});
	}

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	public url(location: string) {

	}

	/**
	 * Get a temporary url for the file
	 * (only works if it's an S3 based provider)
	 *
	 * @param location
	 * @param expiresInSeconds
	 */
	public temporaryUrl(location: string, expiresInSeconds: number) {
		return null;
	}
}
