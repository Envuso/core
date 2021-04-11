import {Storage} from "@envuso/storage";
import {FastifyRequest, HTTPMethods, RawRequestDefaultExpression} from "fastify";
import {Multipart} from "fastify-multipart";
import {UploadedFile} from "./UploadedFile";

export class Request {

	private readonly _request: FastifyRequest;

	/**
	 * If this request contains files that have been uploaded
	 *
	 * Then we will store some information about them here.
	 * At this stage, they have been semi-processed and are
	 * ready to be accessed without async code
	 *
	 * @private
	 */
	private _uploadedFiles: UploadedFile[] = [];

	constructor(request: FastifyRequest) {
		this._request = request;
	}

	get fastifyRequest(): FastifyRequest {
		return this._request;
	}

	/**
	 * Get the value of a header from the request
	 *
	 * @param header
	 * @param _default
	 */
	header(header: string, _default: any = null): string {
		return this._request.headers[header] ?? _default;
	}

	/**
	 * Get all of the headers from the request
	 */
	headers() {
		return this._request.headers;
	}

	/**
	 * Get the body of the request
	 */
	body<T>(): T {
		return <T>this._request.body;
	}

	/**
	 * Get the ip the request originated from
	 */
	ip() {
		return this._request.ip;
	}

	/**
	 * an array of the IP addresses, ordered from closest to furthest,
	 * in the X-Forwarded-For header of the incoming request
	 * (only when the trustProxy option is enabled)
	 *
	 * @see https://www.fastify.io/docs/latest/Request/
	 */
	ips() {
		return this._request.ips;
	}

	/**
	 * The full url of the incoming request
	 */
	url() {
		return this._request.url;
	}

	/**
	 * The method of the incoming request, GET, PUT etc
	 */
	method(): HTTPMethods {
		return <HTTPMethods>this._request.method;
	}

	/**
	 * The id assigned to this request
	 */
	id() {
		return this._request.id;
	}

	/**
	 * Get a value from the request body
	 *
	 * @param key
	 * @param _default
	 */
	get(key: string, _default: any = null) {
		return this._request.body[key] ?? _default;
	}

	/**
	 * Set file information that has been processed and is
	 * ready to upload/stream to s3 etc
	 *
	 * @param file
	 */
	async setUploadedFile(file: Multipart) {
		const tempFileName = await Storage.saveTemporaryFile(
			file.filename, file.file
		);

		this._uploadedFiles.push(new UploadedFile(file, tempFileName));
	}

	/**
	 * Does the request contain any files?
	 */
	hasFiles() {
		return !!this._uploadedFiles.length;
	}

	/**
	 * Get all files on the request
	 */
	files(): UploadedFile[] {
		return this._uploadedFiles;
	}

	/**
	 * Get a singular file on the request
	 *
	 * @param key
	 */
	file(key: string): UploadedFile | null {
		if (!this.hasFiles())
			return null;

		return this._uploadedFiles.find(
			f => f.getFieldName() === key
		) ?? null;
	}


}
