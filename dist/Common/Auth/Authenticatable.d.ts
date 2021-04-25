import { Model } from "../../Database";
export declare class Authenticatable<T> extends Model<T> {
    private _user;
    generateToken(): string;
    setUser(user: any): this;
    getUser<T>(): T;
    toJSON(): Record<string, any>;
}
