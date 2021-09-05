import {Edge} from "edge.js/build/src/Edge";

export interface ViewManagerContract {
	edge: Edge;

	injectViewGlobal(globalName: string, handler: (...args) => any | Promise<any>): void;

	/**
	 * Renders a template from /src/Resources/Views with the provided template parameters.
	 *
	 * @param {string} templatePath
	 * @param {object|undefined} data
	 *
	 * @return {string}
	 */
	render(templatePath: string, data?: any): string;
}
