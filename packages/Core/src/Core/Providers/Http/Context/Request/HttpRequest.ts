import {FastifyRequest} from "fastify";
import {FileUpload} from "@Core";

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
