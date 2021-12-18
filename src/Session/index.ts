export * from "./Session";

import {SessionContract} from "../Contracts/Session/SessionContract";
import {RequestContext} from "../Routing/Context/RequestContext";

export const session = (): SessionContract | null => {
	return RequestContext.session();
};
