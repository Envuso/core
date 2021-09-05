import {Allow, IsString} from "class-validator";
import {response, DataTransferObject, controller, dto, get, destroy, patch, put} from "../../../Routing";
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
