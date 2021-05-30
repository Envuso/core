import {IsString, Length} from "class-validator";
import {Controller, controller, DataTransferObject, dto, post, request, } from "../../../Routing";

class dtoshit extends DataTransferObject {
	@IsString()
	@Length(3, 20)
	something: string;
}

@controller('/lel')
export class TestController extends Controller {

	@post('/test')
	async testMethod(@dto() dto: dtoshit) {
		dto.validate()

		return {id : request().fastifyRequest.id, dto}
	}

	@post('/upload')
	async upload() {
		const file = request().file('file');
		const upload = await file.store('testing')

		return {message : 'woot'};
	}

}
