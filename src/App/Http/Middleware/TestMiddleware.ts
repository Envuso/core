import {Authentication} from "../../../Authentication";
import {Exception} from "../../../Common";
import {AuthenticationContract} from "../../../Contracts/Authentication/AuthenticationContract";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing";

export class TestMiddleware extends Middleware {

	constructor(public authentication?: AuthenticationContract) { super(); }

	public async handle(context: RequestContextContract, authentication?: Authentication) {

//		throw new Exception('get out');

		return true;
	}

}
