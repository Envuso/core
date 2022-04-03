import {URL, URLSearchParams} from "url";


export class Url {

	private _originalUrl: URL;

	constructor(input: string, base?: string | URL) {
		this._originalUrl = new URL(input, base);
	}

	mergeSearchParams(params: URLSearchParams): this {
		params.forEach((value, key) => {
			if (this._originalUrl.searchParams.has(key)) {
				return;
			}
			this._originalUrl.searchParams.set(key, value);
		});

		return this;
	}

	/**
	 * Gets and sets the fragment portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org/foo#bar');
	 * console.log(myURL.hash);
	 * // Prints #bar
	 *
	 * myURL.hash = 'baz';
	 * console.log(myURL.href);
	 * // Prints https://example.org/foo#baz
	 * ```
	 *
	 * Invalid URL characters included in the value assigned to the `hash` property
	 * are `percent-encoded`. The selection of which characters to
	 * percent-encode may vary somewhat from what the {@link parse} and {@link format} methods would produce.
	 */
	get hash(): string {
		return this._originalUrl.hash;
	}

	/**
	 * Gets and sets the host portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org:81/foo');
	 * console.log(myURL.host);
	 * // Prints example.org:81
	 *
	 * myURL.host = 'example.com:82';
	 * console.log(myURL.href);
	 * // Prints https://example.com:82/foo
	 * ```
	 *
	 * Invalid host values assigned to the `host` property are ignored.
	 */
	get host(): string {
		return this._originalUrl.host;
	}

	/**
	 * Gets and sets the host name portion of the URL. The key difference between`url.host` and `url.hostname` is that `url.hostname` does _not_ include the
	 * port.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org:81/foo');
	 * console.log(myURL.hostname);
	 * // Prints example.org
	 *
	 * // Setting the hostname does not change the port
	 * myURL.hostname = 'example.com:82';
	 * console.log(myURL.href);
	 * // Prints https://example.com:81/foo
	 *
	 * // Use myURL.host to change the hostname and port
	 * myURL.host = 'example.org:82';
	 * console.log(myURL.href);
	 * // Prints https://example.org:82/foo
	 * ```
	 *
	 * Invalid host name values assigned to the `hostname` property are ignored.
	 */
	get hostname(): string {
		return this._originalUrl.hostname;
	}

	/**
	 * Gets and sets the serialized URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org/foo');
	 * console.log(myURL.href);
	 * // Prints https://example.org/foo
	 *
	 * myURL.href = 'https://example.com/bar';
	 * console.log(myURL.href);
	 * // Prints https://example.com/bar
	 * ```
	 *
	 * Getting the value of the `href` property is equivalent to calling {@link toString}.
	 *
	 * Setting the value of this property to a new value is equivalent to creating a
	 * new `URL` object using `new URL(value)`. Each of the `URL`object's properties will be modified.
	 *
	 * If the value assigned to the `href` property is not a valid URL, a `TypeError`will be thrown.
	 */
	get href(): string {
		return this._originalUrl.href;
	}

	/**
	 * Gets and sets the password portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://abc:xyz@example.com');
	 * console.log(myURL.password);
	 * // Prints xyz
	 *
	 * myURL.password = '123';
	 * console.log(myURL.href);
	 * // Prints https://abc:123@example.com
	 * ```
	 *
	 * Invalid URL characters included in the value assigned to the `password` property
	 * are `percent-encoded`. The selection of which characters to
	 * percent-encode may vary somewhat from what the {@link parse} and {@link format} methods would produce.
	 */
	get password(): string {
		return this._originalUrl.password;
	}

	/**
	 * Gets and sets the path portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org/abc/xyz?123');
	 * console.log(myURL.pathname);
	 * // Prints /abc/xyz
	 *
	 * myURL.pathname = '/abcdef';
	 * console.log(myURL.href);
	 * // Prints https://example.org/abcdef?123
	 * ```
	 *
	 * Invalid URL characters included in the value assigned to the `pathname`property are `percent-encoded`. The selection of which characters
	 * to percent-encode may vary somewhat from what the {@link parse} and {@link format} methods would produce.
	 */
	get pathname(): string {
		return this._originalUrl.pathname;
	}

	/**
	 * Gets and sets the port portion of the URL.
	 *
	 * The port value may be a number or a string containing a number in the range`0` to `65535` (inclusive). Setting the value to the default port of the`URL` objects given `protocol` will
	 * result in the `port` value becoming
	 * the empty string (`''`).
	 *
	 * The port value can be an empty string in which case the port depends on
	 * the protocol/scheme:
	 *
	 * <omitted>
	 *
	 * Upon assigning a value to the port, the value will first be converted to a
	 * string using `.toString()`.
	 *
	 * If that string is invalid but it begins with a number, the leading number is
	 * assigned to `port`.
	 * If the number lies outside the range denoted above, it is ignored.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org:8888');
	 * console.log(myURL.port);
	 * // Prints 8888
	 *
	 * // Default ports are automatically transformed to the empty string
	 * // (HTTPS protocol's default port is 443)
	 * myURL.port = '443';
	 * console.log(myURL.port);
	 * // Prints the empty string
	 * console.log(myURL.href);
	 * // Prints https://example.org/
	 *
	 * myURL.port = 1234;
	 * console.log(myURL.port);
	 * // Prints 1234
	 * console.log(myURL.href);
	 * // Prints https://example.org:1234/
	 *
	 * // Completely invalid port strings are ignored
	 * myURL.port = 'abcd';
	 * console.log(myURL.port);
	 * // Prints 1234
	 *
	 * // Leading numbers are treated as a port number
	 * myURL.port = '5678abcd';
	 * console.log(myURL.port);
	 * // Prints 5678
	 *
	 * // Non-integers are truncated
	 * myURL.port = 1234.5678;
	 * console.log(myURL.port);
	 * // Prints 1234
	 *
	 * // Out-of-range numbers which are not represented in scientific notation
	 * // will be ignored.
	 * myURL.port = 1e10; // 10000000000, will be range-checked as described below
	 * console.log(myURL.port);
	 * // Prints 1234
	 * ```
	 *
	 * Numbers which contain a decimal point,
	 * such as floating-point numbers or numbers in scientific notation,
	 * are not an exception to this rule.
	 * Leading numbers up to the decimal point will be set as the URL's port,
	 * assuming they are valid:
	 *
	 * ```js
	 * myURL.port = 4.567e21;
	 * console.log(myURL.port);
	 * // Prints 4 (because it is the leading number in the string '4.567e21')
	 * ```
	 */
	get port(): string {
		return this._originalUrl.port;
	}

	/**
	 * Gets and sets the protocol portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org');
	 * console.log(myURL.protocol);
	 * // Prints https:
	 *
	 * myURL.protocol = 'ftp';
	 * console.log(myURL.href);
	 * // Prints ftp://example.org/
	 * ```
	 *
	 * Invalid URL protocol values assigned to the `protocol` property are ignored.
	 */
	get protocol(): string {
		return this._originalUrl.protocol;
	}

	/**
	 * Gets and sets the serialized query portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://example.org/abc?123');
	 * console.log(myURL.search);
	 * // Prints ?123
	 *
	 * myURL.search = 'abc=xyz';
	 * console.log(myURL.href);
	 * // Prints https://example.org/abc?abc=xyz
	 * ```
	 *
	 * Any invalid URL characters appearing in the value assigned the `search`property will be `percent-encoded`. The selection of which
	 * characters to percent-encode may vary somewhat from what the {@link parse} and {@link format} methods would produce.
	 */
	get search(): string {
		return this._originalUrl.search;
	}

	/**
	 * Gets and sets the username portion of the URL.
	 *
	 * ```js
	 * const myURL = new URL('https://abc:xyz@example.com');
	 * console.log(myURL.username);
	 * // Prints abc
	 *
	 * myURL.username = '123';
	 * console.log(myURL.href);
	 * // Prints https://123:xyz@example.com/
	 * ```
	 *
	 * Any invalid URL characters appearing in the value assigned the `username`property will be `percent-encoded`. The selection of which
	 * characters to percent-encode may vary somewhat from what the {@link parse} and {@link format} methods would produce.
	 */
	get username(): string {
		return this._originalUrl.username;
	}

	get origin(): string {
		return this._originalUrl.origin;
	}

	get searchParams(): URLSearchParams {
		return this._originalUrl.searchParams;
	}

	toString() {
		return this._originalUrl.toString();
	}

	toJSON() {
		return this._originalUrl.toJSON();
	}
}
