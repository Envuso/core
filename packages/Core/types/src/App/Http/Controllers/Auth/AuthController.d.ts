import { AuthCredentialContract } from "@App/Contracts/AuthContracts";
import { Controller, DataTransferObject } from "@Providers/Http";
declare class LoginBody extends DataTransferObject implements AuthCredentialContract {
    email: string;
    password: string;
}
declare class RegistrationBody extends LoginBody {
    displayName?: string;
    name: string;
}
export declare class AuthController extends Controller {
    login(loginBody: LoginBody): Promise<import("@Core/Providers").HttpResponse>;
    register(registration: RegistrationBody): Promise<{
        user: import("@Core/Providers").AuthorisedUser;
        token: string;
    }>;
    authedUser(): Promise<{
        contextUser: import("@Core/Providers").AuthorisedUser;
        authUser: import("@Core/Providers").AuthorisedUser;
    }>;
}
export {};
