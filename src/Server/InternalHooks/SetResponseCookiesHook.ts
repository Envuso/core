import {config} from "../../AppContainer/helpers";
import type {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {Cookie} from "../../Cookies/Cookie";
import {CookieValuePrefix} from "../../Cookies/CookieValuePrefix";
import {RabbitEncryption} from "../../Crypt/RabbitEncryption";
import {RequestContext} from "../../Routing/Context/RequestContext";
import type {HookHandlerArgs} from "../ServerHooks/Hook";
import {OnSendHook} from "../ServerHooks/HookTypes/OnSendHook";

/**
 * Set any cookies on the response that have been defined by the user or session middlewares
 */
export class SetResponseCookiesHook extends OnSendHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		const context = RequestContext.get();

		if (!context) {
			return;
		}

		if (context.session) {
			context.response.cookieJar().put(
				context.session.getCookieName(),
				context.session.getId(),
				config().get<string, any>('Session.cookie.encrypted')
			);

			// A token rotated during this request (login) must be the one the cookie carries
			await context.session.regenerateTokenIfPending();

			const xsrfCookie = SetResponseCookiesHook.xsrfCookieName();
			if (xsrfCookie && context.session.getCsrfToken()) {
				// Readable by JavaScript and not encrypted: axios copies it into X-XSRF-TOKEN as-is.
				// The token isn't secret from the page; other origins just can't read it.
				context.response.cookieJar().put(
					xsrfCookie,
					Cookie.create(xsrfCookie, context.session.getCsrfToken())
						.withHttpOnly(false)
						.withEncryption(false)
				);
			}
		}

		const useCookieEncryption = config().get<string, any>('Session.cookie.encrypted');

		const cookies = context.response.cookieJar().all();

		for (let cookie of cookies) {
			if (!useCookieEncryption || cookie.encrypted === false || SetResponseCookiesHook.unencryptedCookieNames().includes(cookie.name)) {
				context.response.setHeader('set-cookie', cookie.toHeaderString());
				continue;
			}

			this.encryptAndSet(context, cookie);
		}
	}

	/**
	 * Cookies sent and read as-is even when Session.cookie.encrypted is on:
	 * Server.disableCookieEncryption (it was never read) and the XSRF cookie
	 */
	public static unencryptedCookieNames(): string[] {
		return [
			...(config().get<string, any>('Server.disableCookieEncryption', []) ?? []),
			SetResponseCookiesHook.xsrfCookieName(),
		].filter(Boolean);
	}

	public static xsrfCookieName(): string | null {
		const name = config().get<string, any>('Session.xsrfCookie', 'XSRF-TOKEN');

		return name || null;
	}

	private encryptAndSet(context: RequestContextContract, cookie: Cookie<any>) {
		cookie.value = RabbitEncryption.encrypt(
			CookieValuePrefix.create(cookie.name, RabbitEncryption.getKey()) + cookie.value
		);

		context.response.setHeader('set-cookie', cookie.toHeaderString());
	}
}
