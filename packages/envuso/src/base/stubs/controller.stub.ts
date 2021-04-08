export const STUB_CONTROLLER = `import {Controller} from "@Providers/Http/Controller/Controller";
import {get, post, controller, middleware} from "@Decorators";


//@middleware()
@controller('/')
export class {{name}} extends Controller {

	@get('/')
	public async index() {

	}

}`
