"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorisedChannelEvent = void 0;
const Exception_1 = require("./Exception");
class UnauthorisedChannelEvent extends Exception_1.Exception {
    constructor() {
        super("No event defined on received ws packet");
    }
}
exports.UnauthorisedChannelEvent = UnauthorisedChannelEvent;
//# sourceMappingURL=UnauthorisedChannelEvent.js.map