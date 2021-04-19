"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRefSpecified = void 0;
const common_1 = require("@envuso/common");
class InvalidRefSpecified extends common_1.Exception {
    constructor(entityName, ref) {
        super('Ref ' + ref + ' is not defined on model(entity) ' + entityName);
    }
}
exports.InvalidRefSpecified = InvalidRefSpecified;
//# sourceMappingURL=InvalidRefSpecified.js.map