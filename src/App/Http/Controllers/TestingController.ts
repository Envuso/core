import {IsString, MinLength} from "class-validator";
import {Auth} from "../../../Authentication";
import {
	body,
	context,
	Controller,
	controller,
	DataTransferObject,
	dto,
	get,
	method,
	middleware,
	Middleware, param, post, query, request,
	RequestContext,
	response,
	session
} from "../../../Routing";
import {User} from "../../Models/User";
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

	constructor(public testController?: TestController) {
		super();
	}

	@get('/decorator/param')
	async testQueryParamDecorator(@query message: string) {
		return message;
	}

	@get('/cookie/is-set')
	async testCookieIsSet() {
		response().cookieJar().put('hello', 'world');

		return true;
	}

	@get('/session/get')
	async testSessionValue() {
		return session().get('testvalue');
	}

	@get('/session/set')
	async testSettingSessionValue() {
		const value = request('value');

		session().put('testvalue', value);

		return true;
	}

	@method(['POST', 'GET'], '/get')
	async testGet(@dto() dt: DTO) {
		return "some info";
	}

	@method(['GET', 'PUT'], '/testget')
	async testMethods(@dto() dt: DTO) {

	}

	@get('/rmb/userobject/:user')
	async testRouteModelBinding(user: User) {
		return response().json(user);
	}

	@get('/rmb/userobject/obj/:user')
	async testRouteModelBindingObj(user: User) {
		return user;
	}

	@get('/rmb/uservalsobj/:user')
	async testRouteModelBindingObjValues(user: User) {
		return {_id : user._id};
	}

	@get('/rmb/uservals/:user')
	async testRouteModelBindingValues(user: User) {
		return response().json({_id : user._id});
	}

	@get('something')
	async something() {
		return {msg : 'hello'};
	}

	@post('/body')
	async testBody(@body body : any) {
		return body.value;
	}

}
