import {Allow, IsString} from "class-validator";
import {DataTransferObject} from "../../../Routing/DataTransferObject/DataTransferObject";
import {controller, get, destroy, patch, put} from "../../../Routing/Controller/ControllerDecorators";
import {dto} from "../../../Routing/Route/RouteDecorators";
import {response} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";
import {User} from "../../Models/User";

class StoreBody extends DataTransferObject {
	@Allow()
	@IsString()
	userId: string;

	@IsString()
	testParam : string;
}

class UpdateBody extends DataTransferObject {

}

//@middleware()
@controller('/user')
export class UserController extends Controller {

	@get('/')
	public async list() {
		const user = await User.query().limit(15).get();

		return response().json({user});
	}

	@get('/:user')
	public async get(user: User) {
		return user;
	}

	@put('/')
	public async store(@dto() body: StoreBody) {
		return body;
	}

	@patch('/:user')
	public async update(user: User, @dto(false) body: UpdateBody) {

	}

	@destroy('/:user')
	public async delete(user: User) {

	}

}
