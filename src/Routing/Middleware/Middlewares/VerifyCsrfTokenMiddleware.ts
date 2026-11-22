import {resolve} from "../../../AppContainer/helpers";
import {CsrfTokenMismatch} from "../../../AppContainer/Exceptions/CsrfTokenMismatch";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import type {CsrfContract} from "../../../Contracts/Security/CsrfContract";
import {Middleware} from "../Middleware";

/**
 * Rejects state-changing requests (anything but GET/HEAD/OPTIONS) that don't carry
 * a CSRF token for the current session.
 *
 * The token is read from (in order):
 *  - the `csrf_token` or `_token` form/body field (`{{ csrfField() }}` in views renders one)
 *  - the `X-CSRF-TOKEN` header
 *  - the `X-XSRF-TOKEN` header (what axios & co. send back from an XSRF-TOKEN cookie)
 *
 * Only session-authenticated routes need this; token-authenticated (JWT) APIs don't.
 * Extend it and override `except` to skip paths, e.g. webhooks.
 */
export class VerifyCsrfTokenMiddleware extends Middleware {

	/**
	 * Paths (exact, or ending in `*` for a prefix) that are not checked
	 */
	protected except: string[] = [];

	protected safeMethods = ['GET', 'HEAD', 'OPTIONS'];

	public async handle(context: RequestContextContract) {
		if (this.safeMethods.includes(context.request.method()) || this.isExcepted(context.request.path())) {
			return;
		}

		const csrf = resolve<CsrfContract>('csrf');

		if (!csrf.verify(context.session.getCsrfSecret(), this.tokenFromRequest(context))) {
			throw new CsrfTokenMismatch();
		}
	}

	protected tokenFromRequest(context: RequestContextContract): string | null {
		const request = context.request;

		const token = request.get<string>('csrf_token', null)
			?? request.get<string>('_token', null)
			?? request.getHeader<string>('x-csrf-token' as any, null)
			?? request.getHeader<string>('x-xsrf-token' as any, null);

		return typeof token === 'string' ? decodeURIComponent(token) : null;
	}

	protected isExcepted(path: string): boolean {
		return this.except.some(pattern => pattern.endsWith('*')
			? path.startsWith(pattern.slice(0, -1))
			: path === pattern);
	}

}
