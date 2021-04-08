import { ObjectId } from "mongodb";
import { ModelEntity } from "Core";
export declare class User extends ModelEntity<User> {
    _id: ObjectId;
    email: string;
    name: string;
    displayName: string;
    password: string;
    createdAt: Date;
    something: number;
}
