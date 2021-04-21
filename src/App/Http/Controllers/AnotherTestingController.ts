import {Controller, controller, get} from "../../../Routing";

@controller('/testing2')
export class AnotherTestingController extends Controller {

	@get('/aids')
	someAids() {
		return true;
	}

}
