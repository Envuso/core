import {Authentication} from "../../../Authentication";
import {Middleware, RequestContext} from "../../../Routing";

export class TestMiddleware extends Middleware {

	constructor(public authentication?: Authentication) { super(); }

	public async handle(context: RequestContext, authentication?: Authentication) {
		return true;
	}

}
