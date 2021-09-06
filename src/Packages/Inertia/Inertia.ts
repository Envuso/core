import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {RequestContext} from "../../Routing";
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

	public static render(component: string, data?: any): InertiaResponse {
		const context = RequestContext.get();

		context.inertia
			.setComponent(component)
			.setProps(data);

		return context.inertia.getResponse();
	}

}
