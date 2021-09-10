import {config} from "../../AppContainer";
import {Cookie, CookieJar} from "../../Cookies";
import {CookieValuePrefix} from "../../Cookies/CookieValuePrefix";
import {RabbitEncryption} from "../../Crypt/RabbitEncryption";
import {RequestContext} from "../../Routing/Context/RequestContext";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

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
			cookieJar._jar.set(cookie.getName(), cookie);
		}

		context.response.setCookieJar(cookieJar);
		context.request.setCookieJar(cookieJar);

		const sessionConfig = config().get<string, any>('Session');

		if (!sessionConfig.cookie.encrypted) {
			return;
		}

		const cookies = context.request.cookieJar().all();

		for (let cookie of cookies) {
			try {
				const value = RabbitEncryption.decrypt<string>(cookie.value);

				const isValid = value.indexOf(
					CookieValuePrefix.create(cookie.name, RabbitEncryption.getKey())
				) === 0;

				cookie.value = isValid ? CookieValuePrefix.remove(value) : null;

				context.request.cookieJar().put(cookie.name, cookie);
			} catch (e) {
				console.log(e);
			}
		}
	}


}
