import {FastifyRequest} from "fastify";
import {Controller} from "../../../Controller/Controller";
import {controller, get} from "../../../Controller/ControllerDecorators";
import {DataTransferObject} from "../../../DataTransferObject/DataTransferObject";
import {dto} from "../../../Route/RouteDecorators";

class DTO extends DataTransferObject {

}

@controller('/testing')
export class TestingController extends Controller {

	@get('/get')
	async testGet(@dto() dt : DTO) {

	}

}
