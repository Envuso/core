import {ConfigRepository, resolve} from "../../AppContainer";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Contracts/Authentication/UserProvider/AuthCredentials";
import {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";
import {ModelContractConstructor} from "../../Contracts/Database/Mongo/ModelContract";
import {Hash} from "../../Crypt";
import {UserProvider} from "./UserProvider";

export class ModelUserProvider extends UserProvider implements UserProviderContract {

	private getInstance<T>(): AuthenticatableContract<T> {
		return resolve<AuthenticatableContract<T>>('Authenticatable');
	}

	private getUserModel<T>(): ModelContractConstructor<T> {
		const userModelName: string = resolve(ConfigRepository).get('Auth').get('userModel');

		return resolve(userModelName + 'Model');
	}

	/**
	 * Get a user by id from mongodb
	 * Uses the model provided in Auth.ts config file(userModel)
	 *
	 * @param id
	 */
	public async getUser<T>(id: string): Promise<AuthenticatableContract<T>> {
		//		const userModel: typeof Model = resolve(ConfigRepository).get<typeof Model>('auth.userModel');

		const userModel = this.getUserModel<T>();

		const user: any = await userModel.find(id);

		if (!user?._id) {
			return null;
		}

		return this.getInstance<T>().setUser(user) as AuthenticatableContract<T>;
	}

	/**
	 * Get a user by it's primary auth identifier(for example, email)
	 * Uses the model provided in Auth.ts config file(userModel)
	 *
	 * @param identifier
	 */
	public async userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<AuthenticatableContract<T>> {
		//const userModel: typeof Model = resolve(ConfigRepository).get<typeof Model>('auth.userModel');

		const userModel = this.getUserModel<T>();

		const primaryIdentifier = resolve(ConfigRepository).get('Auth').get('primaryIdentifier');

		const filter              = {};
		filter[primaryIdentifier] = identifier;

		const user: any = await userModel.where(filter as any).first();

		if (!user?._id) {
			return null;
		}

		return this.getInstance<T>().setUser(user) as AuthenticatableContract<T>;

	}

	public async verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<AuthenticatableContract<T>> {
		const primaryIdentifier = resolve(ConfigRepository).get('Auth').get('primaryIdentifier');

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

		return user as AuthenticatableContract<T>;
	}

}
