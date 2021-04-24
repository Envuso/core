"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class Hash {
    /**
     * Make a hash of the content
     *
     * @param content
     * @param rounds
     */
    static make(content, rounds = 10) {
        return bcrypt_1.default.hash(content, 10);
    }
    /**
     * Check if the content matches the hashed content
     *
     * @param content
     * @param hashedContent
     */
    static check(content, hashedContent) {
        return bcrypt_1.default.compareSync(content, hashedContent);
    }
}
exports.Hash = Hash;
//# sourceMappingURL=Hash.js.map