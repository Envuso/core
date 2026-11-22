import {Authentication} from "../../../Authentication/Authentication";
import {Exception} from "../../../Common/Exception/Exception";
import type {AuthenticationContract} from "../../../Contracts/Authentication/AuthenticationContract";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing/Middleware/Middleware";

export class TestMiddleware extends Middleware {

	constructor(public authentication?: AuthenticationContract) { super(); }

	public async handle(context: RequestContextContract, authentication?: Authentication) {

//		throw new Exception('get out');

		return true;
	}

}
