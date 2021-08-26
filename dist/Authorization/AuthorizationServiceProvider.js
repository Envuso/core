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
exports.AuthorizationServiceProvider = void 0;
const AppContainer_1 = require("../AppContainer");
const Authorization_1 = require("./Authorization");
class AuthorizationServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            app.container().register(Authorization_1.Authorization, { useValue: new Authorization_1.Authorization() });
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AuthorizationServiceProvider = AuthorizationServiceProvider;
//# sourceMappingURL=AuthorizationServiceProvider.js.map