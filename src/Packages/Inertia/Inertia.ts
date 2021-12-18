import {StatusCodes} from "../../Common";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {RedirectResponseContract} from "../../Contracts/Routing/Context/Response/RedirectResponseContract";
import {ResponseContract} from "../../Contracts/Routing/Context/Response/ResponseContract";
import {request, RequestContext, Response, response} from "../../Routing";
import {RedirectResponse} from "../../Routing/Context/Response/RedirectResponse";
import {InertiaResponse} from "./InertiaResponse";

export class Inertia {

	public static share(key: string, data: any): Inertia {
		const context = RequestContext.get();

		context.inertia.share(key, data);

		return this;
	}

	public static isInertiaRequest(request: RequestContract): boolean {
		return request.hasHeader('x-inertia');
	}

	public static location(url: string | RedirectResponseContract): RedirectResponseContract | ResponseContract {
		const redirectTo: string = (url instanceof RedirectResponse)
			? url.getRedirectUrl()
			: url as string;

		if (this.isInertiaRequest(request())) {
			return response()
				.setResponse('', StatusCodes.CONFLICT)
				.withHeader('X-Inertia-Location', redirectTo);
		}

		if (url instanceof RedirectResponse) {
			return url;
		}

		return response().redirectResponse().to(url as string);
	}

	public static render(component: string, data?: any): InertiaResponse {
		const context = RequestContext.get();

		context.inertia
			.setComponent(component)
			.setProps(data);

		return context.inertia.getResponse();
	}

}
