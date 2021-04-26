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
	public async getUser<T>(id: string): Promise<Authenticatable<T>> {
		const userModel: typeof Model = resolve(ConfigRepository).get<typeof Model>('auth.userModel');

		const user: any = await userModel.find(id);

		if (!user?._id) {
			return null;
		}

		return new Authenticatable().setUser(user) as Authenticatable<T>;
	}

	/**
	 * Get a user by it's primary auth identifier(for example, email)
	 * Uses the model provided in Auth.ts config file(userModel)
	 *
	 * @param identifier
	 */
	public async userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<Authenticatable<T>> {
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

		return new Authenticatable().setUser(user) as Authenticatable<T>;

	}

	public async verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<Authenticatable<T>> {
		const primaryIdentifier = resolve(ConfigRepository).get<string>(
			'auth.primaryIdentifier'
		);

		let user = await this.userForIdentifier(
			credentials[primaryIdentifier] as AuthenticationIdentifier
		);

		if (!user) {
			return null;
		}

//		user = user.getUser();

		// Ts ignore until we find a nicer solution for shared structure
		//@ts-ignore
		const password = user.password;
		if (!Hash.check(credentials.password, password)) {
			return null;
		}

		return user as Authenticatable<T>;
	}

}
