import {Inertia} from "../../../Packages/Inertia/Inertia";
import {controller, Controller, get} from "../../../Routing";

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

}
