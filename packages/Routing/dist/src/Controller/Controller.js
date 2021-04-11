"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const common_1 = require("@envuso/common");
class Controller {
    /**
     * Get the metadata for this controller
     * Tells us the target for Reflect and it's path
     */
    getMeta() {
        return {
            controller: Reflect.getMetadata(common_1.METADATA.CONTROLLER, this.constructor),
            methods: Reflect.getMetadata(common_1.METADATA.CONTROLLER_METHODS, this.constructor)
        };
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map