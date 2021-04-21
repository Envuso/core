"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const LogService_1 = require("./LogService");
class Log {
    static log(message, ...args) {
        //@ts-ignore
        if (global.disableConsoleLogs) {
            return;
        }
        LogService_1.LogService.get().log('log', message, Object.assign({}, args));
    }
    static success(message, ...args) {
        //@ts-ignore
        if (global.disableConsoleLogs) {
            return;
        }
        LogService_1.LogService.get().log('success', message, Object.assign({}, args));
    }
    static warn(message, ...args) {
        //@ts-ignore
        if (global.disableConsoleLogs) {
            return;
        }
        LogService_1.LogService.get().warn(message, Object.assign({}, args));
    }
    static error(message, ...args) {
        //@ts-ignore
        if (global.disableConsoleLogs) {
            return;
        }
        LogService_1.LogService.get().error(message, Object.assign({}, args));
    }
    static info(message, ...args) {
        //@ts-ignore
        if (global.disableConsoleLogs) {
            return;
        }
        LogService_1.LogService.get().info(message, Object.assign({}, args));
    }
}
exports.Log = Log;
//# sourceMappingURL=Log.js.map