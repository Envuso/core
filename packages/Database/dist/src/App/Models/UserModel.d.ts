import { ObjectId } from "mongodb";
import { Model } from "../../Mongo/Model";
export declare class UserModel extends Model<UserModel> {
    _id: ObjectId;
    something: string;
}
