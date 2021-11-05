import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {ApiResource} from "../../../Routing";
import {User} from "../../Models/User";

export class UserResource extends ApiResource<User> {
	public transform(request: RequestContextContract): any {
		return {
			_id  : this.data._id,
			name : this.data.name,
		};
	}
}
