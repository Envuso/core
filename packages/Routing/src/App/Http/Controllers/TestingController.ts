import {IsString, MinLength} from "class-validator";
import {FastifyReply, FastifyRequest} from "fastify";
import {RequestContext} from "../../../Context/RequestContext";
import {Controller} from "../../../Controller/Controller";
import {controller, get, method} from "../../../Controller/ControllerDecorators";
import {DataTransferObject} from "../../../DataTransferObject/DataTransferObject";
import {Middleware} from "../../../Middleware/Middleware";
import {middleware} from "../../../Middleware/MiddlewareDecorators";
import {dto} from "../../../Route/RouteDecorators";

class DTO extends DataTransferObject {

	@IsString()
	@MinLength(1)
	something: string;
}

class TestMiddleware extends Middleware {
	public handler(context : RequestContext): Promise<any> {
		console.log(this);
		return Promise.resolve('hello world');
	}

}

@middleware(new TestMiddleware())
@controller('/testing')
export class TestingController extends Controller {

	@method(['POST', 'GET'], '/get')
	async testGet(@dto() dt: DTO) {

	}

	@method(['GET', 'PUT'], '/testget')
	async testMethods(@dto() dt: DTO) {

	}

}
