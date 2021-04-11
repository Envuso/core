//import {classToPlain} from "class-transformer";
//import {inject, injectable} from "inversify";
//import {User} from "@App/Models/User";
//import {Config} from "@Config";
//import {resolve} from "../../Helpers";
//import {AuthProvider} from "./AuthProvider";
//
//@injectable()
//export class AuthorisedUser extends User {
//
//	constructor(user: User) {
//		super();
//
//		Object.assign(this, user);
//	}
//
//	generateToken() {
//		return resolve(AuthProvider).jwtProvider().generateToken(this._id)
//	}
//
//	/**
//	 * When this model instance is returned in a
//	 * response, we'll make sure to use classToPlain so
//	 * that any @Exclude() properties etc are taken care of.
//	 */
//	toJSON() {
//		return classToPlain(this, Config.http.responseSerialization);
//	}
//
//}
