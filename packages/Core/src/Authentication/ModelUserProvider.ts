import {ConfigRepository, resolve} from "@envuso/app";
import {UserProvider} from "@envuso/authentication";
import {Authenticatable} from "@envuso/common";
import {Model} from "@envuso/database";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";
import {User} from "../App/Models/User";

export class ModelUserProvider extends UserProvider {

	/**
	 * Get a user by id from mongodb
	 * Uses the model provided in Auth.ts config file(userModel)
	 *
	 * @param id
	 */
	public async getUser(id: string): Promise<Authenticatable> {
		const userModel: typeof Model = resolve(ConfigRepository).get<typeof Model>('auth.userModel');

		const user: any = await userModel.find(id);

		if (!user?._id) {
			return null;
		}

		return new Authenticatable(user);
	}

	/**
	 * Get a user by it's primary auth identifier(for example, email)
	 * Uses the model provided in Auth.ts config file(userModel)
	 *
	 * @param identifier
	 */
	public async userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable> {
		const userModel: typeof Model = resolve(ConfigRepository).get<typeof Model>('auth.userModel');

		const primaryIdentifier = resolve(ConfigRepository)
			.get<AuthenticationIdentifier>(
				'auth.primaryIdentifier'
			);

		const filter              = {} as Partial<AuthCredentialContract>;
		filter[primaryIdentifier] = identifier;

		const user : any = await userModel.where<Model<any>>(filter as any).first();

		if (!user?._id) {
			return null;
		}

		return new Authenticatable(user);

	}

}
