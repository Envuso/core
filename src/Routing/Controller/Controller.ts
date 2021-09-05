import {Authorization} from "../../Authorization/Authorization";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {ControllerContract} from "../../Contracts/Routing/Controller/ControllerContract";
import {Model} from "../../Database";
import {response} from "../index";

export class Controller implements ControllerContract {

	/**
	 * Return a view on the response
	 *
	 * @param {string} templatePath
	 * @param data
	 */
	public view(templatePath: string, data?: any) {
		return response().view(
			templatePath, data
		);
	}

	/**
	 * Run the call the model policy, using the method which has the name of the permission parameter.
	 *
	 * @param {string} permission
	 * @param {Model<any> | {new(): Model<any>}} model
	 * @param additional
	 * @return {Promise<boolean>}
	 */
	public can(permission: string, model?: Model<any> | (new () => ModelContract<any>), ...additional): Promise<boolean> {
		return Authorization.can(permission, model, ...additional);
	}

	/**
	 * Run the call the model policy, using the method which has the name of the permission parameter.
	 *
	 * @param {string} permission
	 * @param {Model<any> | {new(): Model<any>}} model
	 * @param additional
	 * @return {Promise<boolean>}
	 */
	public cannot(permission: string, model?: Model<any> | (new () => ModelContract<any>), ...additional): Promise<boolean> {
		return Authorization.cannot(permission, model, ...additional);
	}

}
