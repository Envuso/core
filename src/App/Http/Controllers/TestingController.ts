import {IsString, MinLength} from "class-validator";
import {injectable} from "tsyringe";
import {Controller, controller, DataTransferObject, dto, method, middleware, Middleware, RequestContext} from "../../../Routing";
import {TestController} from "./TestController";

class DTO extends DataTransferObject {

	@IsString()
	@MinLength(1)
	something: string;
}

class TestMiddleware extends Middleware {
	public async handler(context: RequestContext) {
		return true;
	}

}


//@middleware(new TestMiddleware())
@controller('/testing')
export class TestingController extends Controller {

	private someValue = false;

	constructor(public testController? : TestController) {
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
