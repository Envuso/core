export const STUB_CONTROLLER_W_MODELS =
`import {response} from "@Core/Helpers";
import {Controller} from "@Providers/Http/Controller/Controller";
import {get, post, put, patch, destroy, controller, middleware, param, dto} from "@Decorators";
import {DataTransferObject} from "@Providers/Http/Controller/DataTransferObject";

class StoreBody extends DataTransferObject {

}
class UpdateBody extends DataTransferObject {

}

//@middleware()
@controller('/')
export class {{name}} extends Controller {

	@get('/')
	public async list() {
		const {{modelParamName}} = await {{modelName}}.query().find().limit(15).toArray();

		return response().json({{{modelParamName}}});
	}

	@get('/:{{modelParamName}}')
	public async get({{modelParamName}} : {{modelName}}) {
		return {{modelParamName}};
	}

	@put('/')
	public async store(@dto() body : StoreBody) {

	}

	@patch('/:{{modelParamName}}')
	public async update({{modelParamName}} : {{modelName}}, @dto() body : UpdateBody) {

	}

	@destroy('/:{{modelParamName}}')
	public async delete({{modelParamName}} : {{modelName}}) {

	}

}
`
