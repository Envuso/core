import { AuthenticationServiceProvider } from "../src/AuthenticationServiceProvider";
export declare const Config: {
    app: {
        appKey: string;
        providers: (typeof AuthenticationServiceProvider)[];
    };
    auth: {
        authenticationProvider: typeof import("..").JwtAuthenticationProvider;
        userProvider: typeof import("..").BaseUserProvider;
        primaryIdentifier: keyof import("./Auth").AuthCredentialContract;
        jwt: {
            authorizationHeaderPrefix: string;
            jwtSigningOptions: import("jsonwebtoken").SignOptions;
            jwtVerifyOptions: import("jsonwebtoken").VerifyOptions;
        };
    };
};
