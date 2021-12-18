import {Controller, controller, get} from "../../../Routing";

@controller('')
export class EmptyTestingController extends Controller {
	@get('/')
	async render() {
		return {};
	}
}
