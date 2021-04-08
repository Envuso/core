import { AuthCredentialContract } from "@App/Contracts/AuthContracts";
import { Controller } from "Core/Providers/Http/Controller/Controller";
import { DataTransferObject } from "Core/Providers/Http/Controller/DataTransferObject";
declare class LoginBody extends DataTransferObject implements AuthCredentialContract {
    email: string;
    password: string;
}
declare class RegistrationBody extends LoginBody {
    displayName?: string;
    name: string;
}
export declare class AuthController extends Controller {
    login(loginBody: LoginBody): Promise<import("../../../..").HttpResponse>;
    register(registration: RegistrationBody): Promise<{
        user: import("../../../..").AuthorisedUser;
        token: string;
    }>;
    authedUser(): Promise<{
        contextUser: import("../../../..").AuthorisedUser;
        authUser: import("../../../..").AuthorisedUser;
    }>;
}
export {};
