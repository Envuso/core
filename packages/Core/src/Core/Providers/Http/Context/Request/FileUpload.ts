import {Exception} from "@App/Exceptions/Exception";
import {Encryption} from "@Providers/Crypt";
import {HttpRequest} from "@Providers/Http";
import {Log} from "@Providers/Log";
import {Storage} from "@Providers/Storage/Storage";
import {UploadedFileInformation} from "@Providers/Storage/StorageProvider";
import {Multipart} from "fastify-multipart";

import {StatusCodes} from "http-status-codes";
import * as fs from "fs";
import path from "path";
import {pipeline} from "stream";

import * as util from 'util'

const pump = util.promisify(pipeline)


export class FileUpload {
	constructor(private request: HttpRequest, private field: string) { }

	async store(location: string): Promise<UploadedFileInformation> {
		let file: Multipart | null = null;

		for await (let upload of this.request.fastifyRequest.files()) {
			if (upload.fieldname === this.field) {
				file = upload;
				break;
			}
		}

		if (!file) {
			throw new Exception('File not found on request.', StatusCodes.BAD_REQUEST);
		}

		const tempName = Encryption.random() + '.' + (file.filename.split('.').pop())
		const tempPath = path.join(__dirname, '..', 'storage', 'temp', tempName);

		await pump(file.file, fs.createWriteStream(tempPath))

		file.filepath = tempPath;

		try {
			const response = await Storage.put(location, file);

			if (fs.existsSync(tempPath))
				fs.rmSync(tempPath);

			return response;
		} catch (error) {
			Log.error(error);
			throw new Exception(
				'Something went wrong uploading the file', StatusCodes.INTERNAL_SERVER_ERROR
			);
		}


	}

}
