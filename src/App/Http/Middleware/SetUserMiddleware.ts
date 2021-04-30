import {Auth} from "../../../Authentication";
import {Authenticatable} from "../../../Common";
import {Middleware, RequestContext} from "../../../Routing";
import {User} from "../../Models/User";

export class SetUserMiddleware extends Middleware {
	public async handle(context: RequestContext): Promise<any> {
		const user = await User.where({email : 'sam@iffdt.dev'}).first();

		Auth.authoriseAs(user);
	}

}
