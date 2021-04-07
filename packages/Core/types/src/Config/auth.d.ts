import { SignOptions, VerifyOptions } from "jsonwebtoken";
export declare const auth: {
    primaryLoginCredential: keyof import("@App/Contracts/AuthContracts").AuthCredentialContract;
    jwtSigningOptions: SignOptions;
    jwtVerifyOptions: VerifyOptions;
};
