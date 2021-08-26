"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const LogService_1 = require("./LogService");
class Log {
    static isLoggingDisabled() {
        //@ts-ignore
        return !!global.disableConsoleLogs;
    }
    static log(message, ...args) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().log('log', message, Object.assign({}, args));
    }
    static success(message, ...args) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().log('success', message, Object.assign({}, args));
    }
    static warn(message, ...args) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().warn(message, Object.assign({}, args));
    }
    static error(message, ...args) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().error(message, Object.assign({}, args));
    }
    static exception(message, error) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().error(message, { error });
    }
    static info(message, ...args) {
        if (this.isLoggingDisabled())
            return;
        LogService_1.LogService.get().info(message, Object.assign({}, args));
    }
}
exports.Log = Log;
//# sourceMappingURL=Log.js.map