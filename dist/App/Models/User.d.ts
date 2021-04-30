import { ObjectId } from "mongodb";
import { Authenticatable } from "../../Common";
export declare class User extends Authenticatable<User> {
    _id: ObjectId;
    email: string;
    something: string;
}
