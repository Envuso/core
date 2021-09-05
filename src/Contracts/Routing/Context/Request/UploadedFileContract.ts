import {Multipart} from "fastify-multipart";
import {FileExtension, MimeType} from "file-type";
import {Stats} from "fs";
import {UploadedFileInformation} from "../../../../Storage";

export interface UploadedFileContract {
	_extension: FileExtension;
	_mimeType: MimeType;
	_fileStat: Stats;
	file: Multipart;
	tempFileName: string;

	/**
	 * Get the mimetype of the uploaded file
	 *
	 * @returns {MimeType|null}
	 */
	getMimeType(): MimeType;

	/**
	 * This should only be used as a fallback if {@see getMimeType()} returns null
	 *
	 * It might not be a supported file type in this case.
	 * @see https://github.com/sindresorhus/file-type#supported-file-types
	 *
	 * @returns {FileExtension}
	 */
	getOriginalMimeType(): MimeType;

	/**
	 * Get the encoder type for the file upload
	 *
	 * @returns {string}
	 */
	getEncoding(): string;

	/**
	 * Get the extension of the file, this is theoretically
	 * safe and taken from the file contents directly.
	 *
	 * @returns {FileExtension | null}
	 */
	getExtension(): FileExtension;

	/**
	 * Get the fs stat values
	 *
	 * @returns {Stats}
	 */
	getFileStat(): Stats;

	/**
	 * Get the size of the file in bytes
	 *
	 * @returns {number}
	 */
	getSize(): number;

	/**
	 * This should only be used as a fallback if {@see getExtension()} returns null
	 *
	 * It might not be a supported file type in this case.
	 * @see https://github.com/sindresorhus/file-type#supported-file-types
	 *
	 * @returns {FileExtension}
	 */
	getOriginalExtension(): FileExtension;

	/**
	 * Get the name of the field that this file was submitted via
	 */
	getFieldName(): string;

	/**
	 * Get the temp file name assigned after uploading the file
	 *
	 * @returns {string}
	 */
	getTempFileName(): string;

	/**
	 * Get the absolute path of the temporary file
	 */
	getTempFilePath(): string;

	/**
	 * Get the file name stored in temp storage
	 *
	 * @returns {string}
	 */
	getOriginalFileName(): string;

	/**
	 * Get the file name without the extension
	 *
	 * @returns {string}
	 */
	getFileNameWithoutExtension(): string;

	/**
	 * Store the uploaded file in the specified directory.
	 *
	 * @param location
	 */
	store(location: string): Promise<UploadedFileInformation>;

	/**
	 * Store the uploaded file in the specified directory using
	 * a user specified file name, rather than generated.
	 *
	 * @param location
	 * @param fileName
	 */
	storeAs(location: string, fileName: string): Promise<UploadedFileInformation>;

	/**
	 * Store the file from the request on our default storage provider
	 *
	 * This method handles store() and storeAs() so there's less code for those methods.
	 *
	 * @param location
	 * @param storeAs
	 */
	storeFile(location: string, storeAs?: string): Promise<UploadedFileInformation>;

	/**
	 * If the temp file exists, it will be deleted.
	 */
	deleteTempFile(): void;

	/**
	 * Should not be used, this is internal framework logic
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	setAdditionalInformation(): Promise<void>;
}
