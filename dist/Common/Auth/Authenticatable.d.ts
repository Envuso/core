import { ObjectId } from "mongodb";
import { Model } from "../../Database";
export declare class Authenticatable extends Model<Authenticatable> {
    private _user;
    _id: ObjectId;
    generateToken(): string;
    setUser(user: any): this;
    toJSON(): Record<string, any>;
}
