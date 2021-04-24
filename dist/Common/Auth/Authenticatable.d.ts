import { Model } from "../../Database";
export declare class Authenticatable<T> extends Model<T> {
    private _user;
    generateToken(): string;
    setUser(user: any): this;
    toJSON(): Record<string, any>;
}
