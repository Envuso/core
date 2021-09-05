import {ModelContract} from "../../Database/Mongo/ModelContract";
import {ResponseContract} from "../Context/Response/ResponseContract";

export interface ControllerContract {

	/**
	 * Return a view on the response
	 *
	 * @param {string} templatePath
	 * @param data
	 */
	view(templatePath: string, data?: any): ResponseContract;

	/**
	 * Run the call the model policy, using the method which has the name of the permission parameter.
	 *
	 * @param {string} permission
	 * @param {ModelContract<any> | {new(): ModelContract<any>}} model
	 * @param additional
	 * @return {Promise<boolean>}
	 */
	can(permission: string, model?: ModelContract<any> | (new () => ModelContract<any>), ...additional): Promise<boolean>;

	/**
	 * Run the call the model policy, using the method which has the name of the permission parameter.
	 *
	 * @param {string} permission
	 * @param {ModelContract<any> | {new(): ModelContract<any>}} model
	 * @param additional
	 * @return {Promise<boolean>}
	 */
	cannot(permission: string, model?: ModelContract<any> | (new () => ModelContract<any>), ...additional): Promise<boolean>;
}
