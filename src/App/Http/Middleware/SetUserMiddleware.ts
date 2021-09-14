import {Auth} from "../../../Authentication";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing";
import {User} from "../../Models/User";

export class SetUserMiddleware extends Middleware {
	public async handle(context: RequestContextContract): Promise<any> {
		const user = await User.query().where({email : 'sam@iffdt.dev'}).first();

		Auth.authoriseAs(user);
	}

}
