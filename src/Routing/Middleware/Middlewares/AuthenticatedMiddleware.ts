import {UnauthorisedException} from "../../../AppContainer/Exceptions/UnauthorisedException";
import {Auth} from "../../../Authentication";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../Middleware";


export class AuthenticatedMiddleware extends Middleware {

	public async handle(context: RequestContextContract) {

		if (!Auth.check()) {
			throw new UnauthorisedException();
		}

	}

}
