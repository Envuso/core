import {IsString, MinLength} from "class-validator";
import {injectable} from "tsyringe";
import {Authentication} from "../../../Authentication";
import {Controller, controller, DataTransferObject, dto, method, middleware, Middleware, RequestContext} from "../../../Routing";
import {TestMiddleware} from "../Middleware/TestMiddleware";
import {TestController} from "./TestController";

class DTO extends DataTransferObject {

	@IsString()
	@MinLength(1)
	something: string;
}




@middleware(new TestMiddleware())
@controller('/testing')
export class TestingController extends Controller {

	private someValue = false;

	constructor(public testController?: TestController) {
		super();
	}

	@method(['POST', 'GET'], '/get')
	async testGet(@dto() dt: DTO) {
		this.someValue = true;

		return this.testController.gimmeInfo();
	}

	@method(['GET', 'PUT'], '/testget')
	async testMethods(@dto() dt: DTO) {

	}

}
