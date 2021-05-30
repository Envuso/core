import {Authorization} from "../../Authorization/Authorization";
import {Model} from "../../Database";

export class Controller {

	can(permission: string, model?: Model<any> | (new () => Model<any>), ...additional): Promise<boolean> {
		return Authorization.can(permission, model, ...additional);
	}

	cannot(permission: string, model?: Model<any> | (new () => Model<any>), ...additional): Promise<boolean> {
		return Authorization.cannot(permission, model, ...additional);
	}

}
