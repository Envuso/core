import {Controller} from "../../../Controller/Controller";
import {controller, get} from "../../../Controller/ControllerDecorators";



@controller('/testing2')
export class AnotherTestingController extends Controller {

	constructor(
		public someController?: AnotherTestingController
	) {
		super()
	}


	someAids() {
		return true;
	}

}
