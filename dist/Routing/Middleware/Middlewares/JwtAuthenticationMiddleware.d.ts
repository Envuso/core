import { RequestContext } from "../../Context/RequestContext";
import { Middleware } from "../Middleware";
export declare class JwtAuthenticationMiddleware extends Middleware {
    handle(context: RequestContext): Promise<void>;
}
