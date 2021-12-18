import {config} from "../../AppContainer";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {Cookie} from "../../Cookies";
import {CookieValuePrefix} from "../../Cookies/CookieValuePrefix";
import {RabbitEncryption} from "../../Crypt/RabbitEncryption";
import {RequestContext} from "../../Routing/Context/RequestContext";
import {HookHandlerArgs, OnSendHook} from "../ServerHooks";

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
		}

		const useCookieEncryption = config().get<string, any>('Session.cookie.encrypted');

		const cookies = context.response.cookieJar().all();

		for (let cookie of cookies) {
			if (!useCookieEncryption) {
				context.response.setHeader('set-cookie', cookie.toHeaderString());
				continue;
			}

			this.encryptAndSet(context, cookie);
		}
	}

	private encryptAndSet(context: RequestContextContract, cookie: Cookie<any>) {
		cookie.value = RabbitEncryption.encrypt(
			CookieValuePrefix.create(cookie.name, RabbitEncryption.getKey()) + cookie.value
		);

		context.response.setHeader('set-cookie', cookie.toHeaderString());
	}
}
