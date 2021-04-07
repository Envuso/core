import { User } from "@App/Models/User";
export declare class AuthorisedUser extends User {
    constructor(user: User);
    generateToken(): string;
    /**
     * When this model instance is returned in a
     * response, we'll make sure to use classToPlain so
     * that any @Exclude() properties etc are taken care of.
     */
    toJSON(): Record<string, any>;
}
