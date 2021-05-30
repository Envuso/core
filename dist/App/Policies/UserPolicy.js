"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPolicy = void 0;
class UserPolicy {
    viewUser(authedUser, user) {
        return user._id === authedUser._id;
    }
    deleteAccount(authedUser, user) {
        return user._id === authedUser._id;
    }
}
exports.UserPolicy = UserPolicy;
//# sourceMappingURL=UserPolicy.js.map