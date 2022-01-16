import {IsNotEmpty, IsString} from "class-validator";
import {Inertia} from "../../../Packages/Inertia/Inertia";
import {back, controller, Controller, DataTransferObject, dto, get, post, redirect} from "../../../Routing";
import {User} from "../../Models/User";
import {UserResource} from "../ApiResources/UserResource";

class TestingDto extends DataTransferObject {
	@IsNotEmpty()
	@IsString()
	message: string;
}

@controller('/inertia')
export class InertiaTestingController extends Controller {

	@get('/')
	async render() {
		return Inertia.render('Hello', {message : 'Hello world'});
	}

	@get('/new-hello')
	async renderTwo() {
		return Inertia.render('HelloPageTwo', {
			value      : () => 1,
			asyncValue : async () => 2,
			message    : 'Wew, a another hello world.'
		});
	}

	@get('/api-resource')
	async testApiResource() {
		return Inertia.render('ApiResource', {
			user : UserResource.from(await User.query().first())
		});
	}

	@post('/dto-validator')
	async testDtoValidation(@dto() data: TestingDto) {
		return back().with('wat', 'test');
	}

}
