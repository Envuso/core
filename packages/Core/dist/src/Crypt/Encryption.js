"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const app_1 = require("@envuso/app");
const simple_crypto_js_1 = __importDefault(require("simple-crypto-js"));
class Encryption {
    static encrypt(content) {
        return app_1.resolve(simple_crypto_js_1.default).encrypt(content);
    }
    static decrypt(content) {
        return app_1.resolve(simple_crypto_js_1.default).decrypt(content);
    }
    static random(length) {
        return simple_crypto_js_1.default.generateRandomString(length);
    }
}
exports.Encryption = Encryption;
//# sourceMappingURL=Encryption.js.map