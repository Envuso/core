import {Authentication} from "../../../Authentication";
import {AuthenticationContract} from "../../../Contracts/Authentication/AuthenticationContract";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing";

export class TestMiddleware extends Middleware {

	constructor(public authentication?: AuthenticationContract) { super(); }

	public async handle(context: RequestContextContract, authentication?: Authentication) {
		return true;
	}

}
