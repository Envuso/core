import {FastifyRequest} from "fastify";
import {Obj, Str} from "../../Common";
import {RequestContext} from "../../Routing/Context/RequestContext";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

export class ConvertEmptyStringsToNullHook extends PreHandlerHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		const context = RequestContext.get();

		if (!context) {
			return;
		}

		const req = (context.request._request as FastifyRequest);

		(context.request._request as FastifyRequest).body = this.mapValues(req.body);

		(context.request._request as FastifyRequest).query = this.mapValues(req.query);
	}


	private mapValues(values: any) {
		if (!values) {
			return values;
		}

		for (let key in values) {

			if (typeof values[key] === 'string') {
				values[key] = Str.isEmpty(values[key]) ? null : values[key];
				continue;
			}

			if (Array.isArray(values[key]) || Obj.isObject(values[key])) {
				values[key] = this.mapValues(values[key]);
			}
		}

		return values;
	}

}
