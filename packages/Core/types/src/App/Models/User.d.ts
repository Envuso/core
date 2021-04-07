import { ModelEntity } from "@Providers/Model/ModelEntity";
import { ObjectId } from "mongodb";
export declare class User extends ModelEntity<User> {
    _id: ObjectId;
    email: string;
    name: string;
    displayName: string;
    password: string;
    createdAt: Date;
    something: number;
}
