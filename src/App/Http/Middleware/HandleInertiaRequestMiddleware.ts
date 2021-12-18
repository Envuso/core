import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {InertiaMiddleware} from "../../../Packages/Inertia/Middleware/InertiaMiddleware";

export class HandleInertiaRequestMiddleware extends InertiaMiddleware {

	public share(context: RequestContextContract) {
		return {
			errors : context.session.store().get('errors', null),
		};
	}

}
