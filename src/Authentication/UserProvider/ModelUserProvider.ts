import {ConfigRepository, resolve} from "../../AppContainer";
import {Authenticatable, Hash} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";
import {Model} from "../../Database";
import {UserProvider} from "./UserProvider";

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

		return new Authenticatable().setUser(user);
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

		const user: any = await userModel.where<Model<any>>(filter as any).first();

		if (!user?._id) {
			return null;
		}

		return new Authenticatable().setUser(user);

	}

	public async verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable> {
		const primaryIdentifier = resolve(ConfigRepository).get<string>(
			'auth.primaryIdentifier'
		);

		const user = await this.userForIdentifier(
			credentials[primaryIdentifier] as AuthenticationIdentifier
		);

		if (!user) {
			return null;
		}

		// Ts ignore until we find a nicer solution for shared structure
		//@ts-ignore
		const password = user.password;
		if (!Hash.check(credentials.password, password)) {
			return null;
		}

		return user;
	}

}
