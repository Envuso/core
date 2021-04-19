"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    /**
     * Contributed by https://github.com/73cn0109y
     * Commit was lost during mono-repo merge :(
     *
     * @returns {boolean}
     */
    static isNode() {
        return (typeof process !== undefined &&
            typeof process.versions !== undefined &&
            typeof process.versions.node !== undefined);
    }
    /**
     * Contributed by https://github.com/73cn0109y
     * Commit was lost during mono-repo merge :(
     *
     * @returns {boolean}
     */
    static isBrowser() {
        try {
            // @ts-ignore
            return (window !== undefined);
        }
        catch (error) {
        }
        return false;
    }
}
exports.Environment = Environment;
exports.default = Environment;
//# sourceMappingURL=Environment.js.map