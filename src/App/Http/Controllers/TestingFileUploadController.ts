import {response, request, DataTransferObject, controller, dto, get, destroy, patch, put, post} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";

//@middleware()
@controller('/files')
export class TestingFileUploadController extends Controller {

	@post('/upload')
	async upload() {
		const req = request();

		const someValue = request('someValue');
		const file      = request().file('file');

	}

}
