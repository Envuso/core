"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthenticationMiddleware = void 0;
const AppContainer_1 = require("../../../AppContainer");
const UnauthorisedException_1 = require("../../../AppContainer/Exceptions/UnauthorisedException");
const Authentication_1 = require("../../../Authentication");
const Middleware_1 = require("../Middleware");
class JwtAuthenticationMiddleware extends Middleware_1.Middleware {
    handle(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const authentication = AppContainer_1.resolve(Authentication_1.Authentication);
            const authedUser = yield Authentication_1.Auth
                .getAuthProvider(Authentication_1.JwtAuthenticationProvider)
                .authoriseRequest(context.request);
            if (!authedUser) {
                throw new UnauthorisedException_1.UnauthorisedException();
            }
            authentication.authoriseAs(authedUser);
            if (!authentication.check()) {
                throw new UnauthorisedException_1.UnauthorisedException();
            }
        });
    }
}
exports.JwtAuthenticationMiddleware = JwtAuthenticationMiddleware;
//# sourceMappingURL=JwtAuthenticationMiddleware.js.map