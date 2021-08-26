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
exports.ModelUserProvider = void 0;
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
const UserProvider_1 = require("./UserProvider");
class ModelUserProvider extends UserProvider_1.UserProvider {
    /**
     * Get a user by id from mongodb
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param id
     */
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.userModel');
            const user = yield userModel.find(id);
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return null;
            }
            return new Common_1.Authenticatable().setUser(user);
        });
    }
    /**
     * Get a user by it's primary auth identifier(for example, email)
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param identifier
     */
    userForIdentifier(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.userModel');
            const primaryIdentifier = AppContainer_1.resolve(AppContainer_1.ConfigRepository)
                .get('auth.primaryIdentifier');
            const filter = {};
            filter[primaryIdentifier] = identifier;
            const user = yield userModel.where(filter).first();
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return null;
            }
            return new Common_1.Authenticatable().setUser(user);
        });
    }
    verifyLoginCredentials(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const primaryIdentifier = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.primaryIdentifier');
            let user = yield this.userForIdentifier(credentials[primaryIdentifier]);
            if (!user) {
                return null;
            }
            //		user = user.getUser();
            // Ts ignore until we find a nicer solution for shared structure
            //@ts-ignore
            const password = user.password;
            if (!Common_1.Hash.check(credentials.password, password)) {
                return null;
            }
            return user;
        });
    }
}
exports.ModelUserProvider = ModelUserProvider;
//# sourceMappingURL=ModelUserProvider.js.map