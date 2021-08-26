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
exports.BaseUserProvider = void 0;
const Common_1 = require("../../Common");
const UserProvider_1 = require("./UserProvider");
class BaseUserProvider extends UserProvider_1.UserProvider {
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Common_1.Authenticatable().setUser({ id });
        });
    }
    userForIdentifier(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Common_1.Authenticatable().setUser(identifier);
        });
    }
    verifyLoginCredentials(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Common_1.Authenticatable().setUser(credentials);
        });
    }
}
exports.BaseUserProvider = BaseUserProvider;
//# sourceMappingURL=BaseUserProvider.js.map