import {FileUpload} from "@Providers/Http";
import {FastifyRequest} from "fastify";

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
