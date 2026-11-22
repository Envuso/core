import {config} from "../../AppContainer/helpers";
import {Cookie} from "../../Cookies/Cookie";
import {CookieJar} from "../../Cookies/CookieJar";
import {Encryption} from "../../Crypt/Encryption";
import {RequestContext} from "../../Routing/Context/RequestContext";
import type {HookHandlerArgs} from "../ServerHooks/Hook";
import {PreHandlerHook} from "../ServerHooks/HookTypes/PreHandlerHook";
import {SetResponseCookiesHook} from "./SetResponseCookiesHook";

/**
 * This hook will initiate our request context
 * Our request context stores fastify's request/reply for this request
 * It will also store our authorised user if any and more...
 *
 * Without RequestContext, we can't have certain parts of the framework
 * work with each user/request that we get hit with.
 */
export class InitiateRequestContextHook extends PreHandlerHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		const context = RequestContext.get();

		if (!context) {
			return;
		}

		const cookieJar        = new CookieJar();
		const processedCookies = Cookie.fromHeader(context.request.fastifyRequest.raw.headers.cookie || '');

		for (let cookie of processedCookies) {
			// Not sent back unless the app changes it (re-sending also reset its path/expiry)
			cookie.fromRequest = true;
			cookieJar._jar.set(cookie.getName(), cookie);
		}

		context.response.setCookieJar(cookieJar);
		context.request.setCookieJar(cookieJar);

		const sessionConfig = config().get<string, any>('Session');

		if (!sessionConfig.cookie.encrypted) {
			return;
		}

		const cookies     = context.request.cookieJar().all();
		const unencrypted = SetResponseCookiesHook.unencryptedCookieNames();

		for (let cookie of cookies) {
			// Sent unencrypted (see SetResponseCookiesHook)
			if (unencrypted.includes(cookie.name)) {
				continue;
			}

			// Bound to the cookie's name, so one cookie's value can't be swapped into another.
			// Anything that doesn't decrypt (tampered, another key, a 2.x cookie) is null.
			cookie.value = Encryption.tryDecrypt<string>(cookie.value, `cookie:${cookie.name}`);
		}
	}


}
