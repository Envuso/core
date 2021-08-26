import { User } from "../Models/User";
export declare class UserPolicy {
    viewUser(authedUser: User, user: User): boolean;
    deleteAccount(authedUser: User, user: User): boolean;
}
