import {FastifyRequest} from "fastify";

export class Request {

	private readonly _request: FastifyRequest;

	constructor(request: FastifyRequest) {
		this._request = request;
	}

	get fastifyRequest(): FastifyRequest {
		return this._request;
	}

}
