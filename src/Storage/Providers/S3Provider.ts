import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	type ListObjectsV2CommandInput,
	type ListObjectsV2CommandOutput,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import {Str} from "../../Common/Utility/Str";
import {type S3StorageProviderConfiguration, StorageProviderContract, type StoragePutOptions, type UploadedFileInformation} from "../StorageProviderContract";

export class S3Provider extends StorageProviderContract {

	private s3: S3Client;
	private _config: S3StorageProviderConfiguration = null;

	constructor(config: S3StorageProviderConfiguration) {
		super();

		this._config = config;

		this.s3 = new S3Client({
			endpoint       : config.endpoint || undefined,
			region         : config.region || 'us-east-1',
			forcePathStyle : config.forcePathStyle ?? false,
			credentials    : config.credentials,
		});
	}

	/**
	 * Get the files from the target directory
	 *
	 * @param directory
	 * @param recursive
	 */
	public async files(directory: string, recursive: boolean = false): Promise<string[]> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		// The bucket root has no prefix; "/" would only match keys that literally start with a slash
		const pages = await this.listAll({Prefix : directory === '/' ? '' : directory});

		return pages.flatMap(page => (page.Contents ?? []).map(f => f.Key));
	}

	/**
	 * Get all directories in the directory
	 *
	 * @param directory
	 */
	public async directories(directory: string): Promise<string[]> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		const pages = await this.listAll({Delimiter : directory});

		return pages.flatMap(page => (page.CommonPrefixes ?? []).map(d => d.Prefix));
	}

	/**
	 * Create a new directory
	 *
	 * @param directory
	 */
	public async makeDirectory(directory: string): Promise<boolean> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		const result = await this.s3.send(new PutObjectCommand(this.withAcl({
			Bucket : this._config.bucket,
			Key    : directory,
			Body   : '',
		})));

		return !!result.ETag;
	}

	/**
	 * Delete a directory
	 *
	 * @param directory
	 */
	public async deleteDirectory(directory: string): Promise<boolean> {
		if (!directory.endsWith('/')) {
			directory += '/';
		}

		if (directory === '/') {
			throw new Error('S3: refusing to delete the whole bucket (deleteDirectory("/")).');
		}

		// A "directory" is a key prefix: delete everything under it, not only the "dir/"
		// marker object (files inside used to survive)
		const pages = await this.listAll({Prefix : directory});
		const keys  = pages.flatMap(page => (page.Contents ?? []).map(object => object.Key));

		// DeleteObjects takes up to 1000 keys per request
		for (let i = 0; i < keys.length; i += 1000) {
			const result = await this.s3.send(new DeleteObjectsCommand({
				Bucket : this._config.bucket,
				Delete : {Objects : keys.slice(i, i + 1000).map(Key => ({Key})), Quiet : true},
			}));

			if (result.Errors?.length) {
				throw new Error(`S3: failed to delete ${result.Errors.length} object(s) under "${directory}": ${result.Errors[0].Message}`);
			}
		}

		return true;
	}

	/**
	 * Check if a file exists at the location
	 *
	 * @param key
	 */
	public async fileExists(key: string): Promise<boolean> {
		try {
			const result = await this.s3.send(new HeadObjectCommand({
				Bucket : this._config.bucket,
				Key    : key,
			}));

			return !!result.ContentLength;
		} catch (error) {
			if (error?.name === 'NotFound' || error?.$metadata?.httpStatusCode === 404) {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Get the contents of a file
	 *
	 * @param location
	 */
	public async get(location: string): Promise<string> {
		const result = await this.s3.send(new GetObjectCommand({
			Bucket : this._config.bucket,
			Key    : location,
		}));

		return await result.Body.transformToString();
	}

	/**
	 * Write a string into a file at the specified location
	 *
	 * @param {string} location
	 * @param {string} contents
	 * @return {Promise<UploadedFileInformation>}
	 */
	public async write(location: string, contents: string): Promise<UploadedFileInformation> {
		await this.s3.send(new PutObjectCommand(this.withAcl({
			Bucket : this._config.bucket,
			Key    : location,
			Body   : contents
		})));

		return {
			url          : `${this._config.url}/${location}`,
			path         : location,
			originalName : location
		} as UploadedFileInformation;
	}

	/**
	 * Create a new file and put the contents
	 *
	 * @param location
	 * @param file
	 */
	public async put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation> {
		const extension = file.filename.split(".").pop();
		const newName   = Str.random() + "." + extension;
		const fileKey   = location + "/" + (file.storeAs ? file.storeAs : newName);

		await this.s3.send(new PutObjectCommand(this.withAcl({
			Bucket        : this._config.bucket,
			Key           : fileKey,
			Body          : fs.createReadStream(file.tempFilePath),
			// Streams need an explicit length for a single PutObject
			ContentLength : (await fs.promises.stat(file.tempFilePath)).size,
		})));

		return {
			url          : `${this._config.url}/${fileKey}`,
			path         : fileKey,
			originalName : file.filename
		} as UploadedFileInformation;
	}

	/**
	 * Delete a file
	 *
	 * @param location
	 */
	public async remove(location: string): Promise<boolean> {
		await this.s3.send(new DeleteObjectCommand({
			Bucket : this._config.bucket,
			Key    : location,
		}));

		return true;
	}

	/**
	 * Get the url for the file
	 *
	 * @param location
	 */
	public url(location: string): string {
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
	public temporaryUrl(location: string, expiresInSeconds: number): Promise<string> {
		return getSignedUrl(this.s3, new GetObjectCommand({
			Bucket : this._config.bucket,
			Key    : location,
		}), {expiresIn : expiresInSeconds});
	}

	/**
	 * ListObjectsV2 returns at most 1000 keys per call, so follow continuation tokens.
	 */
	private async listAll(input: Omit<ListObjectsV2CommandInput, 'Bucket'>): Promise<ListObjectsV2CommandOutput[]> {
		const pages: ListObjectsV2CommandOutput[] = [];
		let token: string | undefined             = undefined;

		do {
			const page: ListObjectsV2CommandOutput = await this.s3.send(new ListObjectsV2Command({
				...input,
				Bucket            : this._config.bucket,
				ContinuationToken : token,
			}));
			pages.push(page);
			token = page.IsTruncated ? page.NextContinuationToken : undefined;
		} while (token);

		return pages;
	}

	/**
	 * Apply the configured canned ACL. Defaults to "public-read" (previous behaviour);
	 * set `acl: null` for buckets with ACLs disabled (the AWS default for new buckets).
	 */
	private withAcl(input: PutObjectCommandInput): PutObjectCommandInput {
		const acl = this._config.acl === undefined ? 'public-read' : this._config.acl;

		return acl ? {...input, ACL : acl} : input;
	}
}
