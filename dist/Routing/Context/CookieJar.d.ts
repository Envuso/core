import { FastifyRequest } from "fastify";
export interface SessionConfiguration {
    cookie: CookieConfiguration;
    cookieName: string;
    encryptCookies: boolean;
}
export interface CookieConfiguration {
    path: string;
    httpOnly: boolean;
    secure: boolean;
    expires: Date;
    sameSite: boolean;
    domain: null;
}
export declare class CookieJar {
    private _config;
    private _jar;
    private _secret;
    constructor();
    /**
     * Set a key/value to be added to the request as a cookie.
     *
     * @param key
     * @param value
     */
    put(key: any, value: any): void;
    /**
     * Get a cookies value from the request or one that was set in the response.
     *
     * @param key
     * @param _default
     * @returns {string | null}
     */
    get<T>(key: any, _default?: any): T;
    /**
     * Check if X cookie has been added to the request/response
     *
     * @param key
     * @returns {boolean}
     */
    has(key: any): boolean;
    /**
     * Parse the cookies from the request and store them on the cookie jar
     *
     * @param {FastifyRequest} request
     * @returns {this}
     */
    setCookies(request: FastifyRequest): this;
    setCookiesOnResponse(): void;
}
