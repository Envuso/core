import {resolve} from "../../../AppContainer";
import {CsrfTokenMismatch} from "../../../AppContainer/Exceptions/CsrfTokenMismatch";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {CsrfContract} from "../../../Contracts/Security/CsrfContract";
import {Middleware} from "../Middleware";


export class VerifyCsrfTokenMiddleware extends Middleware {

	public async handle(context: RequestContextContract) {
		const csrf = resolve<CsrfContract>('csrf');

		if (!csrf.verify(context.session.getCsrfSecret(), context.session.getCsrfToken())) {
			await context.session.regenerateToken();
			throw new CsrfTokenMismatch();
		}
	}

	public async after(context: RequestContextContract) {
		await context.session.regenerateToken();
	}

}
