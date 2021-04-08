import {Exclude, Type} from "class-transformer";
import {IsEmail, IsNotEmpty} from "class-validator";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {Id, ModelEntity} from "@Core";

@injectable()
export class User extends ModelEntity<User> {

	@Id
	_id: ObjectId;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	name: string;

	displayName: string;

	@Exclude({toPlainOnly : true})
	password: string;

	createdAt: Date;

	@Type(() => Number)
	something: number;
}



