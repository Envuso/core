"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const tslib_1 = require("tslib");
const simple_crypto_js_1 = tslib_1.__importDefault(require("simple-crypto-js"));
const AppContainer_1 = require("../../AppContainer");
class Encryption {
    static encrypt(content) {
        return AppContainer_1.resolve(simple_crypto_js_1.default).encrypt(content);
    }
    static decrypt(content) {
        return AppContainer_1.resolve(simple_crypto_js_1.default).decrypt(content);
    }
    static random(length) {
        return simple_crypto_js_1.default.generateRandomString(length);
    }
}
exports.Encryption = Encryption;
//# sourceMappingURL=Encryption.js.map