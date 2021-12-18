import {User} from "../Models/User";

export class UserPolicy {

	public viewUser(authedUser: User, user: User) {
		return user._id === authedUser._id;
	}

	public deleteAccount(authedUser: User, user: User) {
		return user._id === authedUser._id;
	}

}
