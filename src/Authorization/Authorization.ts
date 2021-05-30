import {ClassConstructor} from "class-transformer";
import {injectable} from "tsyringe";
import {resolve} from "../AppContainer";
import {Authentication} from "../Authentication";
import {Classes} from "../Common";
import {Model} from "../Database";
import {PolicyNotFound} from "./Exceptions/PolicyNotFound";
import {PolicyPermissionNotFound} from "./Exceptions/PolicyPermissionNotFound";

export type ModelConstructorOrInstantiatedModel = (Model<any>) | (new () => Model<any>)

@injectable()
export class Authorization {

	public static getPolicyForModel<T extends ModelConstructorOrInstantiatedModel>(model: T) {
		const policyConstructor = Reflect.getMetadata(
			'authorization-policy', Classes.getConstructor(model)
		);

		if (!policyConstructor) {
			throw new PolicyNotFound(model.constructor.name);
		}

		return new policyConstructor();
	}

	private static getPermissionFromPolicy<T extends ModelConstructorOrInstantiatedModel>(
		model, permission: string
	): Function {

		const policy = this.getPolicyForModel<T>(model);

		if (!policy[permission]) {
			throw new PolicyPermissionNotFound(model.constructor.name, permission);
		}

		return policy[permission];
	}


	public static async can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model?: T, ...additional) {
		const policyPermission = this.getPermissionFromPolicy(model, permission);

		return await policyPermission(resolve(Authentication).user(), model, ...additional) === true;
	}

	public static async cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model?: T, ...additional) {
		return await this.can(permission, model, ...additional) === false;
	}

}
