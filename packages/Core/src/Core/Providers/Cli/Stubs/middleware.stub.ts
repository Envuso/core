export const STUB_MIDDLEWARE = `import {FastifyReply, FastifyRequest} from "fastify";
import {injectable} from "inversify";
import {Middleware} from "@Providers/Http/Controller/Middleware";


@injectable()
export class {{name}} extends Middleware {

	public async handler(request: FastifyRequest, response: FastifyReply) {

	}

}
`
