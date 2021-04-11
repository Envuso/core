import {ConfigRepository, resolve} from "@envuso/app";
import {Exception, Log} from "@envuso/common";
import {Storage, UploadedFileInformation} from "@envuso/storage";
import {FastifyRequest} from "fastify";
import {Multipart} from "fastify-multipart";
import * as fs from "fs";
import {StatusCodes} from "http-status-codes";
import path from "path";
import {RequestContext} from "../RequestContext";

export class UploadedFile {

	constructor(
		private file: Multipart,
		private tempFileName: string
	) { }

	/**
	 * Get the name of the field that this file was submitted via
	 */
	getFieldName(): string {
		return this.file.fieldname;
	}

	/**
	 * Get the absolute path of the temporary file
	 */
	getTempFilePath(): string {
		const tempPath = resolve(ConfigRepository).get<string>('paths.temp');

		return path.join(tempPath, this.tempFileName);
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
}
