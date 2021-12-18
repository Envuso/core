import {StatusCodes} from "../../../Common";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {Middleware} from "../../../Routing";
import {Inertia} from "../Inertia";


export class InertiaMiddleware extends Middleware {

	public async handle(context: RequestContextContract): Promise<any> {
		context.inertia.setVersion(this.version(context));
		context.inertia.setSharedData(this.share(context));

		if (this.needsForceUpdate(context)) {
			return this.getVersionUpdateResponse(context);
		}
	}

	public async after(context: RequestContextContract) {
		this.changeRedirectCode(context);

		if(context.request.method() === 'GET') {
			context.session.store().setPreviousUrl(context.request.url());
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
		return context.request.method() === 'GET' &&
			context.request.hasHeader('x-inertia') &&
			context.request.getHeader('x-inertia-version') !== context.inertia.getVersion();
	}

	private getVersionUpdateResponse(context: RequestContextContract) {
		if (context.hasSession()) {
			context.session.store().reflash();
		}

		return Inertia.location(context.request.url());
	}

	private changeRedirectCode(context: RequestContextContract) {
		if (
			context.inertia.isInertiaRequest() &&
			context.response.code === StatusCodes.MOVED_TEMPORARILY &&
			['PUT', 'PATCH', 'DELETE'].includes(context.request.method())
		) {
			context.response.setCode(StatusCodes.SEE_OTHER);
		}
	}
}
