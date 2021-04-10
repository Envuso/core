import {IsString, MinLength} from "class-validator";
import {FastifyRequest} from "fastify";
import {Controller} from "../../../Controller/Controller";
import {controller, get, method} from "../../../Controller/ControllerDecorators";
import {DataTransferObject} from "../../../DataTransferObject/DataTransferObject";
import {dto} from "../../../Route/RouteDecorators";

class DTO extends DataTransferObject {

	@IsString()
	@MinLength(1)
	something: string;
}

@controller('/testing')
export class TestingController extends Controller {

	@method(['POST', 'GET'], '/get')
	async testGet(@dto() dt: DTO) {

	}

	@method(['GET', 'PUT'], '/testget')
	async testMethods(@dto() dt: DTO) {

	}

}
