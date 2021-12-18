import {config} from "../../AppContainer";
import {response} from "../../Routing";
import {InertiaPageData} from "./Contracts/InertiaRequestContract";

export class InertiaResponse {

	private page: InertiaPageData;
	private responseType: "json" | "view" = "view";

	/**
	 * Set the inertia page data from {@see InertiaRequest}
	 *
	 * @param {InertiaPageData} page
	 * @returns {this}
	 */
	setResponse(page: InertiaPageData) {
		this.page = page;

		return this;
	}

	/**
	 * Set this response type to return a view
	 *
	 * @returns {this}
	 */
	asView() {
		this.responseType = 'view';

		return this;
	}

	/**
	 * Set this response type to return JSON
	 *
	 * @returns {this}
	 */
	asJson() {
		this.responseType = 'json';

		return this;
	}

	/**
	 * Check which response type we're using
	 *
	 * @param {"json" | "view"} type
	 * @returns {boolean}
	 * @private
	 */
	private isResponseType(type: "json" | "view"): boolean {
		return this.responseType === type;
	}

	/**
	 * Get the inertia page data and resolve the async props if there are any
	 *
	 * @returns {Promise<InertiaPageData>}
	 * @private
	 */
	private async getResponse() {
		let page = this.page;

		if (typeof page.props === 'function') {
			//@ts-ignore
			page.props = await page.props();
		}

		return page;
	}

	/**
	 * Resolve the async props if there are any
	 * Then we'll finally send off the response as the correct type
	 *
	 * @template FastifyReply
	 * @returns {Promise<FastifyReply>}
	 */
	async sendResponse() {
		const pageData = await this.getResponse();

		if (this.isResponseType("json")) {
			return response().json(pageData).send();
		}

		return response().view(config('inertia.rootView', 'index'), {
			page : JSON.stringify(pageData)
		}).send();
	}
}
