"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const Authorization_1 = require("../../Authorization/Authorization");
class Controller {
    can(permission, model, ...additional) {
        return Authorization_1.Authorization.can(permission, model, ...additional);
    }
    cannot(permission, model, ...additional) {
        return Authorization_1.Authorization.cannot(permission, model, ...additional);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map