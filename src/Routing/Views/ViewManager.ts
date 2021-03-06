import edge from 'edge.js';
import {TagContract} from "edge.js/build/src/Contracts";
import {Edge} from "edge.js/build/src/Edge";
import {config} from "../../AppContainer";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";

export class ViewManager implements ViewManagerContract {

	public edge: Edge;

	constructor() {
		this.edge = edge.mount(config().get<string, any>('Paths.views'));
	}

	public registerGlobal(globalName: string, handler: (...args) => any | Promise<any>) {
		this.edge.global(globalName, (...args) => handler(...args));
	}

	public registerTag(handler: TagContract) {
		this.edge.registerTag(handler);
	}

	/**
	 * Renders a template from /src/Resources/Views with the provided template parameters.
	 *
	 * @param {string} templatePath
	 * @param {object|undefined} data
	 *
	 * @return {string}
	 */
	public render(templatePath: string, data?: any): string {
		return edge.renderSync(templatePath, data);
	}

}
