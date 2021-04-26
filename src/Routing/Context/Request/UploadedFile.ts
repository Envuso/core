import {FastifyRequest} from "fastify";
import {Multipart} from "fastify-multipart";
import {Stats} from "fs";
import * as fs from "fs";
import {StatusCodes} from "http-status-codes";
import path from "path";
import {ConfigRepository, resolve} from "../../../AppContainer";
import {Exception, Log} from "../../../Common";
import {Storage, UploadedFileInformation} from "../../../Storage";
import {RequestContext} from "../RequestContext";
import {default as FileType, FileExtension, MimeType} from 'file-type';
import * as readChunk from "read-chunk";

export class UploadedFile {

	private _extension: FileExtension = null;
	private _mimeType: MimeType       = null;
	private _fileStat: Stats          = null;

	constructor(
		private file: Multipart,
		private tempFileName: string
	) { }

	/**
	 * Get the mimetype of the uploaded file
	 *
	 * @returns {MimeType|null}
	 */
	getMimeType(): MimeType {
		return this._mimeType;
	}

	/**
	 * This should only be used as a fallback if {@see getMimeType()} returns null
	 *
	 * It might not be a supported file type in this case.
	 * @see https://github.com/sindresorhus/file-type#supported-file-types
	 *
	 * @returns {FileExtension}
	 */
	getOriginalMimeType(): MimeType {
		return this.file.mimetype as MimeType;
	}

	/**
	 * Get the encoder type for the file upload
	 *
	 * @returns {string}
	 */
	getEncoding(): string {
		return this.file.encoding;
	}

	/**
	 * Get the extension of the file, this is theoretically
	 * safe and taken from the file contents directly.
	 *
	 * @returns {FileExtension | null}
	 */
	getExtension(): FileExtension {
		return this._extension;
	}

	/**
	 * Get the fs stat values
	 *
	 * @returns {Stats}
	 */
	getFileStat(): Stats {
		return this._fileStat;
	}

	/**
	 * Get the size of the file in bytes
	 *
	 * @returns {number}
	 */
	getSize(): number {
		const stat = this.getFileStat();

		return stat?.size ?? null;
	}

	/**
	 * This should only be used as a fallback if {@see getExtension()} returns null
	 *
	 * It might not be a supported file type in this case.
	 * @see https://github.com/sindresorhus/file-type#supported-file-types
	 *
	 * @returns {FileExtension}
	 */
	getOriginalExtension(): FileExtension {
		return this.file.filename.split(".").pop() as FileExtension;
	}

	/**
	 * Get the name of the field that this file was submitted via
	 */
	getFieldName(): string {
		return this.file.fieldname;
	}

	/**
	 * Get the temp file name assigned after uploading the file
	 *
	 * @returns {string}
	 */
	getTempFileName(): string {
		return this.tempFileName;
	}

	/**
	 * Get the absolute path of the temporary file
	 */
	getTempFilePath(): string {
		const tempPath = resolve(ConfigRepository).get<string>('paths.temp');

		return path.join(tempPath, this.tempFileName);
	}

	/**
	 * Get the file name stored in temp storage
	 *
	 * @returns {string}
	 */
	getOriginalFileName(): string {
		return this.file.filename;
	}

	/**
	 * Get the file name without the extension
	 *
	 * @returns {string}
	 */
	getFileNameWithoutExtension(): string {
		return this.getOriginalFileName().split('.').shift() ?? null;
	}

	/**
	 * Store the uploaded file in the specified directory.
	 *
	 * @param location
	 */
	async store(location: string): Promise<UploadedFileInformation> {
		return this.storeFile(location);
	}

	/**
	 * Store the uploaded file in the specified directory using
	 * a user specified file name, rather than generated.
	 *
	 * @param location
	 * @param fileName
	 */
	async storeAs(location: string, fileName: string): Promise<UploadedFileInformation> {
		return this.storeFile(location, fileName);
	}

	/**
	 * Store the file from the request on our default storage provider
	 *
	 * This method handles store() and storeAs() so there's less code for those methods.
	 *
	 * @param location
	 * @param storeAs
	 */
	private async storeFile(location: string, storeAs?: string): Promise<UploadedFileInformation> {

		let response = null;

		try {
			response = await Storage.put(location, {
				tempFilePath : this.getTempFilePath(),
				filename     : this.file.filename,
				storeAs      : storeAs
			});
		} catch (error) {
			Log.error(error);

			this.deleteTempFile();

			throw new Exception(
				'Something went wrong uploading the file', StatusCodes.INTERNAL_SERVER_ERROR
			);
		}

		this.deleteTempFile();

		return response;
	}

	/**
	 * If the temp file exists, it will be deleted.
	 */
	deleteTempFile() {
		const tempFilePath = this.getTempFilePath();

		if (fs.existsSync(tempFilePath))
			fs.rmSync(tempFilePath);
	}

	/**
	 * We will bind the uploaded file from the request into our request
	 * context, so that it is ready to be processed and any async operations
	 * have already been handled and are completed.
	 *
	 * @param request
	 */
	public static async addToRequest(request: FastifyRequest) {

		if (!request.isMultipart)
			return;

		const context = RequestContext.get();

		if (!context)
			return;

		await context.request.setUploadedFile(
			await request.file()
		);

	}

	/**
	 * Should not be used, this is internal framework logic
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	public async setAdditionalInformation() {
		try {

			const filePath        = path.join('storage', 'temp', this.tempFileName);
			const buffer          = readChunk.sync(filePath, 0, 4100);
			const fileInformation = await FileType.fromBuffer(buffer);

			this._extension = fileInformation?.ext;
			this._mimeType  = fileInformation?.mime;

			// There's a chance the uploaded file isn't supported
			// https://github.com/sindresorhus/file-type#supported-file-types
			// In this case, we'll read the data from the upload
			// and probably make a bad decision to trust it...

			if (!this._extension) {
				this._extension = this.getOriginalExtension();
			}
			if (!this._mimeType) {
				this._mimeType = this.getOriginalMimeType();
			}

			this._fileStat = fs.statSync(this.getTempFilePath());

		} catch (error) {
			throw new Exception('Something went wrong when trying to get mimetype/extension of uploaded file.');
		}
	}
}
