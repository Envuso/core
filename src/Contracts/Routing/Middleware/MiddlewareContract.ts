import {RequestContextContract} from "../Context/RequestContextContract";

export interface MiddlewareContract {
	handle(context: RequestContextContract): Promise<any>;

	after(context: RequestContextContract): Promise<any>;
}
