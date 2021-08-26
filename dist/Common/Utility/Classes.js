"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classes = void 0;
class Classes {
    /**
     * Check if a class has been instantiated
     *
     * @param c
     * @returns {boolean}
     */
    static isInstantiated(c) {
        return (typeof c.prototype === "undefined");
    }
    /**
     * If a class has been instantiated, get the underlying constructor
     * Otherwise, return the constructor
     *
     * @param c
     * @returns {boolean}
     */
    static getConstructor(c) {
        if (this.isInstantiated(c)) {
            return c.constructor;
        }
        return c;
    }
}
exports.Classes = Classes;
//# sourceMappingURL=Classes.js.map