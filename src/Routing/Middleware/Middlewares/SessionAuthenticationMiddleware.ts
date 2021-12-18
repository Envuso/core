import {resolve} from "../../../AppContainer";
import {UnauthorisedException} from "../../../AppContainer/Exceptions/UnauthorisedException";
import {Authentication, JwtAuthenticationProvider, SessionAuthenticationProvider} from "../../../Authentication";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../Middleware";


export class SessionAuthenticationMiddleware extends Middleware {

	public async handle(context: RequestContextContract) {
		const authentication = resolve(Authentication);
		const provider       = authentication.getAuthProvider(SessionAuthenticationProvider);
		const authedUser     = await provider.authoriseRequest(context.request);

		if (!authedUser) {
			throw new UnauthorisedException();
		}

		authentication.authoriseAs(authedUser);

		if (!authentication.check()) {
			throw new UnauthorisedException();
		}

	}

}
