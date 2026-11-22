import path from "path";
import {Str} from "../../Common/Utility/Str";
import fs from 'fs';
import {FileDoesNotExistException} from "../Exceptions/FileDoesNotExistException";
import {type LocalStorageProviderConfiguration, StorageProviderContract, type StoragePutOptions, type UploadedFileInformation} from "../StorageProviderContract";

export class LocalFileProvider extends StorageProviderContract {
	public basePath: string;

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

	public pathWithoutFileName(directory: string) {
		// path.dirname: the paths are OS paths (backslashes on Windows), so searching for "/" found nothing
		return path.dirname(directory);
	}

	/**
	 * Is there a directory at this path?
	 */
	public async directoryExists(directory: string): Promise<boolean> {
		try {
			return (await fs.promises.stat(this.formatPath(directory))).isDirectory();
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Create a directory (and any missing parents)
	 *
	 * @param directory
	 */
	public async makeDirectory(directory: string): Promise<boolean> {
		await fs.promises.mkdir(this.formatPath(directory), {recursive : true});

		return true;
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
			fs.stat(key, (err, stat) => {
				if (!stat || err) {
					return resolve(false);
				}

				resolve(true);
			});
		});
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public get(location: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			if (!await this.fileExists(location)) {
				reject(new FileDoesNotExistException(this.formatPath(location)));

				return;
			}

			location = this.formatPath(location);

			fs.readFile(location, {encoding : 'utf-8'}, (error, contents) => {
				if (error) {
					return reject(error);
				}
				return resolve(contents);
			});
		});
	}

	/**
	 * Write a string into a file at the specified location
	 *
	 * @param {string} location
	 * @param {string} contents
	 * @return {Promise<UploadedFileInformation>}
	 */
	public async write(location: string, contents: string): Promise<UploadedFileInformation> {
		const storagePath = this.formatPath(location);

		await fs.promises.mkdir(path.dirname(storagePath), {recursive : true});
		await fs.promises.writeFile(storagePath, contents, {encoding : 'utf-8'});

		const pathInfo = path.parse(storagePath);

		return {
			url          : location,
			path         : storagePath,
			// pathInfo.ext includes the dot ("file..txt" before)
			originalName : pathInfo.base,
		};
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
		const root    = path.resolve(this.basePath);
		const inside  = (candidate: string) => {
			const relative = path.relative(root, candidate);
			return !relative.startsWith('..') && !path.isAbsolute(relative);
		};

		// A full path already inside the disk is used as-is; anything else (including
		// "/uploads/x") is relative to the disk root, as before
		const resolved = inside(path.resolve(definedPath)) && path.isAbsolute(definedPath)
			? path.resolve(definedPath)
			: path.resolve(path.join(root, definedPath));

		// "../" must not reach outside the disk's root
		if (!inside(resolved)) {
			throw new Error(`Path "${definedPath}" is outside of the storage disk root (${root}).`);
		}

		return resolved;
	}
}
