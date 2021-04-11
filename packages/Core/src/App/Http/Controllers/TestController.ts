import {controller, Controller, DataTransferObject, dto, get, post, request} from "@envuso/routing";
import {IsString} from "class-validator";
import {FastifyRequest} from "fastify";

class dtoshit extends DataTransferObject {
	@IsString()
	something: string;
}

@controller('/lel')
export class TestController extends Controller {

	/**
	 * TYPE CASTING THE METHOD LIKE
	 * (REQ: FASTIFYREQUEST) WILL BREAK FUCKING EVERYTHING
	 *
	 * @TODO: FIX PLS
	 */

	@post('/test')
	async testMethod(@dto() dto: dtoshit) {

		return {id : request().fastifyRequest.id, dto}
	}

	@post('/upload')
	async upload() {
		const file = request().file('file');
		const upload = await file.store('testing')

		return {message : 'woot'};
	}

}
