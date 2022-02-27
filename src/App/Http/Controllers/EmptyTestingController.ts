import {Controller, controller, get, request} from "../../../Routing";

@controller('')
export class EmptyTestingController extends Controller {
	@get('/')
	async render() {
		const req = request();
		const b   = req.rawBody();

		return {};
	}
}
