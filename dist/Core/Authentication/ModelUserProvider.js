"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUserProvider = void 0;
const tslib_1 = require("tslib");
const AppContainer_1 = require("../../AppContainer");
const Authentication_1 = require("../../Authentication");
const Common_1 = require("../../Common");
class ModelUserProvider extends Authentication_1.UserProvider {
    /**
     * Get a user by id from mongodb
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param id
     */
    getUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userModel = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.userModel');
            const user = yield userModel.find(id);
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return null;
            }
            return new Common_1.Authenticatable(user);
        });
    }
    /**
     * Get a user by it's primary auth identifier(for example, email)
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param identifier
     */
    userForIdentifier(identifier) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userModel = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.userModel');
            const primaryIdentifier = AppContainer_1.resolve(AppContainer_1.ConfigRepository)
                .get('auth.primaryIdentifier');
            const filter = {};
            filter[primaryIdentifier] = identifier;
            const user = yield userModel.where(filter).first();
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return null;
            }
            return new Common_1.Authenticatable(user);
        });
    }
}
exports.ModelUserProvider = ModelUserProvider;
//# sourceMappingURL=ModelUserProvider.js.map