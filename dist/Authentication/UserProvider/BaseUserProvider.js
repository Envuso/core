"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUserProvider = void 0;
const tslib_1 = require("tslib");
const Common_1 = require("../../Common");
const UserProvider_1 = require("./UserProvider");
class BaseUserProvider extends UserProvider_1.UserProvider {
    getUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Common_1.Authenticatable(id);
        });
    }
    userForIdentifier(identifier) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Common_1.Authenticatable(identifier);
        });
    }
}
exports.BaseUserProvider = BaseUserProvider;
//# sourceMappingURL=BaseUserProvider.js.map