import {StatusCodes} from "../../../Common";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing";


export class InertiaMiddleware extends Middleware {

	public async handle(context: RequestContextContract): Promise<any> {
		context.inertia.setVersion(this.version(context));
		context.inertia.setSharedData(this.share(context));

		if (this.needsForceUpdate(context)) {
			return this.getVersionUpdateResponse(context);
		}
	}

	/**
	 * @TODO: Actually check config/laravel mix file for version
	 *
	 * @param {RequestContextContract} context
	 * @returns {string}
	 */
	public version(context: RequestContextContract) {
		return "1";
	}

	public share(context: RequestContextContract) {
		return {};
	}

	private needsForceUpdate(context: RequestContextContract) {
		if (
			context.request.method() === 'GET' &&
			context.request.hasHeader('x-inertia') &&
			context.request.getHeader('x-inertia-version') !== context.inertia.getVersion()
		) {
			return true;
		}

		return false;
	}

	private getVersionUpdateResponse(context: RequestContextContract) {
		if (context.hasSession()) {
			context.session.store().reflash();
		}

		return context.response
			.setHeader('x-inertia-location', context.request.url())
			.setResponse({}, StatusCodes.CONFLICT)
			.send();
	}
}
