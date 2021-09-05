import {DateTime} from "../../Common";
import {DateTimeContract} from "../Common/Utility/DateTimeContract";
import {CookieSameSiteValue} from "../Session/Types";

export interface CookieContract<T> {
	name: string;
	value: T | string;
	maxAge: DateTime;
	domain: string;
	path: string;
	expires: DateTime;
	httpOnly: boolean;
	secure: boolean;
	sameSite: CookieSameSiteValue;
	signed: boolean;

	isValid(value: any): boolean;

	/**
	 * Set the default cookie configuration settings from our config
	 */
	setDefaultCookieSettings(): void;

	/**
	 * Parse the cookie settings and create a string which can be set on the response header.
	 *
	 * @return {string}
	 */
	toHeaderString(): string;

//	signCookieValue(value: string): string;

	/**
	 * If we're using cookie signing, this will return the signed cookie value.
	 * Otherwise, it will return the regular value
	 *
	 * @return {string}
	 */
//	getSignedValueOrRegular(): string;

	/**
	 * If we're using cookie signing, we'll attempt to get the underlying value
	 *
	 * If the value is no longer "safe", we'll return null instead.
	 *
	 * @return {string | null}
	 */
//	getUnsignedValue(): string | null;

	getName(): string;

	withName(value: string): CookieContract<T>;

	getValue(): T | string;

	withValue(value: T): CookieContract<T>;

	withMaxAge(value: DateTime): CookieContract<T>;

	getMaxAge(): DateTimeContract;

	withDomain(value: string): CookieContract<T>;

	getDomain(): string;

	withPath(value: string): CookieContract<T>;

	getPath(): string;

	withExpiresAt(value: DateTime): CookieContract<T>;

	getExpires(): DateTimeContract;

	withHttpOnly(value: boolean): CookieContract<T>;

	isHttpOnly(): boolean;

	withSecure(value: boolean): CookieContract<T>;

	getSecure(): boolean;

	withSameSite(value: CookieSameSiteValue): CookieContract<T>;

	getSameSite(): CookieSameSiteValue;

	signCookie(value?: boolean): CookieContract<T>;

	isSigned(): boolean;
}
