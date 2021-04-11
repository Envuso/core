"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedToBindException = void 0;
class FailedToBindException extends Error {
    constructor(binding) {
        super("Cannot bind to the container");
        console.error(binding);
    }
}
exports.FailedToBindException = FailedToBindException;
//# sourceMappingURL=FailedToBindException.js.map