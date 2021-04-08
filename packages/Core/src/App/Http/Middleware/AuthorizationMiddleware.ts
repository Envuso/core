import {UnauthorisedException} from "@App/Exceptions/UnauthorisedException";
import {FastifyReply, FastifyRequest} from "fastify";
import {injectable} from "inversify";
import {Auth, AuthProvider, Middleware, resolve} from "@Core";


@injectable()
export class AuthorizationMiddleware extends Middleware {

	public async handler(request: FastifyRequest, response: FastifyReply) {
		await resolve(AuthProvider).authoriseRequest(request, response);

		if (!Auth.check()) {
			throw new UnauthorisedException();
		}
	}

}
