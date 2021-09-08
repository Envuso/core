import {IsString, MinLength} from "class-validator";
import {ObjectId} from "mongodb";
import {Auth} from "../../../Authentication";
import {Authorization} from "../../../Authorization/Authorization";
import {EventManager} from "../../../Events";
import {redirect, request, response, view} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";
import {controller, get, method, post} from "../../../Routing/Controller/ControllerDecorators";
import {DataTransferObject} from "../../../Routing/DataTransferObject/DataTransferObject";
import {middleware} from "../../../Routing/Middleware/MiddlewareDecorators";
import {JwtAuthenticationMiddleware} from "../../../Routing/Middleware/Middlewares/JwtAuthenticationMiddleware";
import {VerifyCsrfTokenMiddleware} from "../../../Routing/Middleware/Middlewares/VerifyCsrfTokenMiddleware";
import {dto, query, body, user} from "../../../Routing/Route/RouteDecorators";
import {session} from "../../../Session";
import {TestingEventDispatcher} from "../../Events/Dispatchers/TestingEventDispatcher";
import {User} from "../../Models/User";
import {UserSocketListener} from "../Sockets/UserSocketListener";

class DTO extends DataTransferObject {

	@IsString()
	@MinLength(1)
	something: string;
}

/**
 * @namespace TestingController
 */

	//@middleware(new TestMiddleware())
@controller('/testing')
export class TestingController extends Controller {


	@get('/rmb/userobject/:user')
	async testRouteModelBinding(user: User) {
		return response().json(user);
	}

	@middleware(new JwtAuthenticationMiddleware())
	@post('/auth/userdecorator')
	public async testUserDecorator(@user user: User, @dto() dt: DTO) {
		return {user};
	}

	@get('/redirect')
	async redirect(@query message: string) {
		return response().redirect('https://google.com');
	}

	@get('/redirect/route')
	async redirectToRoute(@query message: string) {
		return redirect().route('TestingController.testQueryParamDecorator', {
			message : 'Hello!',
			yeet : 'fdsf'
		});
	}

	@get('/decorator/param')
	async testQueryParamDecorator(@query message: string) {
		return message;
	}

	@get('/cookie/is-set')
	async testCookieIsSet() {
		response().cookieJar().put('hello', 'world');
		response().cookieJar().put('hello-two', 'world', true);

		return true;
	}

	@get('/cookie/test-encrypted')
	async testCookieEncryption() {
		console.log(response().cookieJar().get('hello'));

		const signedCookie = response().cookieJar().get('hello-two');

		console.log('Unsigned cookie value: ', signedCookie.getValue());
		console.log('Unsigned cookie value2: ', signedCookie.getValue());

		return true;
	}

	@get('/session/get')
	async testSessionValue() {
		return {
			value : session().store().get('testvalue')
		};
	}

	@get('/session/set')
	async testSettingSessionValue() {
		const value = request('value');

		session().store().put('testvalue', value);

		return true;
	}

	@method(['POST', 'GET'], '/get')
	async testGet(@dto() dt: DTO) {
		return "some info";
	}

	@method(['GET', 'PUT'], '/testget')
	async testMethods(@dto() dt: DTO) {

	}

	@method(['DELETE', 'POST'], '/testget')
	async testMethodsTwo(@dto() dt: DTO) {

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
	async testBody(@body body: any) {
		return body.value;
	}

	@post('/')
	async testRegularSlash() {

	}

	@post('/failed/dto')
	async testFailingDto(@dto() dto: DTO) {
		return dto;
	}

	@post('/file/upload')
	async testUploadFile() {
		const file = request().file('file');

		return {
			extension         : file.getExtension(),
			encoding          : file.getEncoding(),
			mimetype          : file.getMimeType(),
			original_filename : file.getOriginalFileName(),
			temp_filename     : file.getTempFileName(),
			without_extension : file.getFileNameWithoutExtension(),
			size              : file.getSize(),
		};
	}

	@get('/auth/token')
	async getToken() {
		const user = await User.where({email : 'sam@iffdt.dev'}).first();

		return user.generateToken();
	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/auth/event')
	async sendSocketEventToAuthedUser(/*@user userd: User*/) {
		const user = Auth.user<User>();
		//		user.sendSocketEvent('wewt', {message : 'yeah boi'});

		user.sendSocketChannelEvent(UserSocketListener, 'wewt', {message : 'yeah boi'});

		return {};
	}

	@get('/model/pagination')
	async testPagination() {
		return User.paginate(1);
	}

	@get('/model/pagination/filtered')
	async testPaginationFiltered() {
		return User.where({something : "randomtext"}).paginate(1);
	}

	@get()
	async testQueryBuilderMethod() {
		User.where({
			something : 'el'
		});

		User.findOne({
			something : 'lel'
		});

		User.get({
			something : 'lel'
		}, {
			sort : {
				something : 1
			}
		});

		User.count();

		User.find('lele', 'something');

		User.orderByDesc('something');

		User.where({_id : new ObjectId('lel')}).orderByDesc('something');

		User.orderByDesc('something');

		User.create({});

		const users = await User.where({}).orderByAsc('something').get();

		const user = await User.where({}).first();

	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy')
	async testFailingUserPolicy(@user user: User) {

		const otherUser = await User.create({});

		const result = await Authorization.can('deleteAccount', otherUser);

		return {result};

	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy/successful')
	async testSuccessfulUserPolicy(@user user: User) {
		const result = await Authorization.can('deleteAccount', user);

		return {result};
	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy/controller')
	async testFailingUserPolicyOnController(@user user: User) {

		const otherUser = await User.create({});

		const result = await this.can('deleteAccount', otherUser);

		return {result};

	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy/controller/successful')
	async testSuccessfulUserPolicyOnController(@user user: User) {
		const result = await this.can('deleteAccount', user);

		return {result};
	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy/controller/user')
	async testFailingUserPolicyOnUser(@user user: User) {

		const otherUser = await User.create({});

		const result = await user.can('deleteAccount', otherUser);

		return {result};

	}

	@middleware(new JwtAuthenticationMiddleware())
	@get('/user/policy/controller/user/successful')
	async testSuccessfulUserPolicyOnUser(@user user: User) {
		const result = await user.can('deleteAccount', user);

		return {result};
	}


	@get('/events/dispatching')
	async testDispatchingEvent() {
		TestingEventDispatcher.dispatch('hello!');
		EventManager.dispatch('authed', ['wew, hi']);
		EventManager.dispatch('TestingEventDispatcher', ['wew, hi']);

		return {};
	}

	@get('/view')
	async testRenderingView() {
		return view('testing-view', {message : 'Hello!'});
		//		return this.view('testing-view', {message : 'Hello!'})
	}

	@get('/view/flash')
	async testRenderingViewWithFlash() {
		return redirect()
			.route('TestingController.testRenderingView')
			.with('testing-flash', true)
			.withInput({messageflashed:'wewt?'})
	}

	@middleware(new VerifyCsrfTokenMiddleware())
	@post('/view/post')
	async testRenderingViewPost() {
		session().store().put('testing-post', true);
		session().store().increment('testing-post-value', 1);

		return response().redirect('http://127.0.0.1:3000/testing/view');
	}

	@get('/view/negotiated')
	async testNegotiatedResponse() {
		const data = {message : 'Hello!'};

		return response().negotiated(
			data,
			{templatePath : 'testing-view', data}
		);
	}


	@get('/view/404')
	async test404Response() {
		return response().notFound();
	}


	@get('/view/500')
	async test500Response() {
		return response().internalError();
	}

	@get('/testing/:item/:itemtwo/three/:four')
	async testingRouteParams() {
		return response().internalError();
	}

}
