import {FileUpload} from "@Providers/Http/Context/Request/FileUpload";
import {Storage} from "@Providers/Storage/Storage";
import {UploadedFileInformation} from "@Providers/Storage/StorageProvider";
import busboy from "busboy";
import {FastifyRequest} from "fastify";
import {Multipart} from "fastify-multipart";
import * as fs from "fs";
import * as os from "os";
import path from "path";
import {pipeline} from "stream";
import * as util from "util";

const pump = util.promisify(pipeline)

export class HttpRequest {

	private readonly _request: FastifyRequest;

	constructor(request: FastifyRequest) {
		this._request = request;
	}

	get fastifyRequest() {
		return this._request;
	}

	file(field: string) {
		return new FileUpload(this, field);
	}


}
