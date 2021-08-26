export type S3StorageProviderConfiguration = {
	bucket: string;
	url: string;
	endpoint: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	}
}

export type LocalStorageProviderConfiguration = {
	root: string;
}

export interface UploadedFileInformation {
	url: string;
	path: string;
	originalName: string;
}

export interface StoragePutOptions {
	/**
	 * The location of the file to store in the desired provider
	 */
	tempFilePath: string;
	/**
	 * The name of the original file
	 * This is set by the internals when a file is uploaded
	 * If you wish to change the outputted file name, use {@see storeAs}
	 */
	filename: string;
	/**
	 * If you wish to give the file a specific name, set it here.
	 */
	storeAs?: string;
}

export abstract class StorageProviderContract {

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 * @param recursive
	 */
	abstract files(directory: string, recursive?: boolean): Promise<string[]>;

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	abstract directories(directory: string): Promise<string[]>;

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	abstract makeDirectory(directory: string): Promise<boolean>;

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	abstract deleteDirectory(directory: string): Promise<boolean> ;

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	abstract fileExists(key: string): Promise<boolean>;

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	abstract get(location: string): Promise<string> ;

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	abstract put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation>;

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	abstract remove(location: string): Promise<boolean>;

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	abstract url(location: string): string;

	/**
	 * Get a temporary url for the file
	 * (only works if it's an S3 based provider)
	 *
	 * @param location
	 * @param expiresInSeconds
	 */
	abstract temporaryUrl(location: string, expiresInSeconds: number): Promise<string>;

}
