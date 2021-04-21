"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Str = void 0;
const tslib_1 = require("tslib");
const Obj_1 = tslib_1.__importDefault(require("./Obj"));
class Str {
    /**
     * Uses math.random() to get a quick and dirty random string
     * Lot's quicker but cannot guarantee it's unique in the moment.
     *
     * Quick perf test; 1000 iterations of 100 char string in 0.46-0.47ms
     *
     * @param length
     */
    static random(length = 10) {
        const getRandom = () => Math.random().toString(20).substr(2, length);
        let currentStr = getRandom();
        if (currentStr.length <= length) {
            return currentStr.slice(0, length);
        }
        while (currentStr.length < length) {
            currentStr += getRandom();
        }
        return currentStr.slice(0, length);
    }
    /**
     * Uses node.js crypto module to give a more unique random string
     *
     * Quick perf test; 1000 iterations of 100 char string in 8.93-9.23ms
     *
     * @param length
     */
    static uniqueRandom(length = 10) {
        return require('crypto').randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .substr(0, length);
    }
    /**
     * Contributed by https://github.com/73cn0109y
     * Commit was lost during mono-repo merge :(
     */
    static isEmpty(value) {
        return (Obj_1.default.isNullOrUndefined(value) || String(value).trim().length === 0);
    }
}
exports.Str = Str;
//# sourceMappingURL=Str.js.map