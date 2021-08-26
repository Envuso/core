import path from "path";
import {Str} from "../../Common";
import fs from 'fs';
import {LocalStorageProviderConfiguration, StorageProviderContract, StoragePutOptions, UploadedFileInformation} from "../StorageProviderContract";

export class LocalFileProvider extends StorageProviderContract {
	private basePath: string;

	constructor(config: LocalStorageProviderConfiguration) {
		super();

		this.basePath = config.root ?? '';
	}

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 * @param recursive
	 */
	public files(directory: string, recursive: boolean = false): Promise<string[]> {
		directory = this.formatPath(directory);

		return new Promise((resolve, reject) => {

			const listFiles = (dirName, files_?: string[]) => {
				files_    = files_ || [];
				let files = fs.readdirSync(dirName);

				for (let i in files) {
					const name        = dirName + '/' + files[i];
					const isDirectory = fs.statSync(name).isDirectory();

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

			resolve(
				listFiles(directory).map(
					name => name.replace(directory + '/', '').replace(directory, '')
				)
			);
		});
	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public directories(directory: string): Promise<string[]> {
		directory = this.formatPath(directory);

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
		directory = this.formatPath(directory);

		return new Promise((resolve, reject) => {

			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, {recursive : true});
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
		directory = this.formatPath(directory);

		return new Promise((resolve, reject) => {
			if (!fs.existsSync(directory)) {
				return resolve(true);
			}

			fs.rmSync(directory, {recursive : true});

			resolve(fs.existsSync(directory) === false);
		});
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public fileExists(key: string): Promise<boolean> {
		key = this.formatPath(key);

		return new Promise((resolve, reject) => {
			const stat = fs.statSync(key);

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
	public get(location: string): Promise<string> {
		location = this.formatPath(location);

		return new Promise((resolve, reject) => {
			resolve(fs.readFileSync(location, {encoding : 'utf-8'}));
		});
	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation> {
		location = this.formatPath(location);

		return new Promise((resolve, reject) => {
			const extension = file.filename.split(".").pop();
			const newName   = Str.random() + "." + extension;
			const fileKey   = path.join(location, (file.storeAs ? file.storeAs : newName));

			const writeStream = fs.createWriteStream(fileKey);

			const readStream = fs.createReadStream(file.tempFilePath);

			readStream.on('open', function () {
				readStream.pipe(writeStream);
			});

			readStream.on('error', function (err) {
				reject(err);
			});

			readStream.on('end', () => {
				resolve(<UploadedFileInformation>{
					url          : null,
					path         : fileKey,
					originalName : file.filename
				});
			});
		});
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public remove(location: string): Promise<boolean> {
		location = this.formatPath(location);

		return new Promise((resolve, reject) => {
			fs.rm(location, (err) => {
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
	public url(location: string): string {
		return null;
	}

	/**
	 * Get a temporary url for the file
	 * (only works if it's an S3 based provider)
	 *
	 * @param location
	 * @param expiresInSeconds
	 */
	public temporaryUrl(location: string, expiresInSeconds: number): Promise<string> {
		return null;
	}

	private formatPath(definedPath: string) {
		return path.resolve(path.join(this.basePath, definedPath));
	}
}
