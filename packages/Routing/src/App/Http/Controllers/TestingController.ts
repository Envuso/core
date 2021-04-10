import {Controller} from "../../../Controller/Controller";
import {controller, get} from "../../../Controller/ControllerDecorators";



@controller('/testing')
export class TestingController extends Controller {

	@get('/get')
	async testGet() {

	}

}
