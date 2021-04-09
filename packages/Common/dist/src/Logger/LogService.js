"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const chalk_1 = __importDefault(require("chalk"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, label, prettyPrint, printf, colorize, cli, ms } = winston_1.format;
let instance = null;
class LogService {
    constructor() {
        this.loggerInstance = null;
    }
    create() {
        const rotateFile = new winston_daily_rotate_file_1.default({
            dirname: "./storage/logs",
            filename: "%DATE%-app.log",
            format: combine(winston_1.format.timestamp({ format: 'M/D HH:mm:ss.SSS' }), winston_1.format.ms(), printf((_a) => {
                var { level, message, label, ms, timestamp } = _a, metadata = __rest(_a, ["level", "message", "label", "ms", "timestamp"]);
                if (ms) {
                    if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
                        ms = `${ms}`;
                    }
                    else {
                        ms = `${ms}`;
                    }
                }
                let msg = `[${timestamp}][${level} ${ms}] : ${message}`;
                if (metadata && Object.keys(metadata).length) {
                    try {
                        msg += '\n';
                        msg += JSON.stringify(metadata, null, "    ");
                    }
                    catch (error) {
                    }
                }
                return msg;
            })),
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d"
        });
        const myFormat = printf((_a) => {
            var { level, message, label, ms, timestamp } = _a, metadata = __rest(_a, ["level", "message", "label", "ms", "timestamp"]);
            if (ms) {
                if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
                    ms = chalk_1.default.redBright `${ms}`;
                }
                else {
                    ms = chalk_1.default.greenBright `${ms}`;
                }
            }
            timestamp = chalk_1.default.gray(`[${timestamp}]`);
            let levelColor = chalk_1.default.white;
            let messageColor = chalk_1.default.white;
            switch (level) {
                case 'log':
                    levelColor = chalk_1.default.bgGray.whiteBright.bold;
                    break;
                case 'warn':
                    levelColor = chalk_1.default.bgYellow.whiteBright.bold;
                    break;
                case 'error':
                    levelColor = chalk_1.default.bgRed.whiteBright.bold;
                    break;
                case 'success':
                    levelColor = chalk_1.default.bgGreen.whiteBright.bold;
                    break;
                case 'info':
                    levelColor = chalk_1.default.bgBlue.whiteBright.bold;
                    break;
            }
            switch (level) {
                case 'log':
                    messageColor = chalk_1.default.gray;
                    break;
                case 'warn':
                    messageColor = chalk_1.default.yellow;
                    break;
                case 'error':
                    messageColor = chalk_1.default.red;
                    break;
                case 'success':
                    messageColor = chalk_1.default.green;
                    break;
                case 'info':
                    messageColor = chalk_1.default.blue;
                    break;
            }
            level = levelColor ` ${level.toUpperCase()} `;
            const levelWrap = chalk_1.default.gray `${level}`;
            message = messageColor `${message}`;
            let msg = `${timestamp} ${levelWrap} ${message} ${ms}`;
            if (metadata && Object.keys(metadata).length) {
                try {
                    msg += '\n';
                    msg += JSON.stringify(metadata, null, "    ");
                }
                catch (error) {
                }
            }
            return msg;
        });
        const cliTransport = new winston_1.transports.Console({
            handleExceptions: true,
            format: combine(winston_1.format.timestamp({ format: 'HH:mm:ss' }), ms(), myFormat),
        });
        this.loggerInstance = winston_1.createLogger({
            levels: {
                debug: 0,
                success: 1,
                info: 2,
                warn: 3,
                error: 4
            },
            level: 'error',
            exitOnError: false,
            handleExceptions: false,
            exceptionHandlers: [
                cliTransport,
                rotateFile
            ],
            transports: [
                cliTransport,
                rotateFile
            ]
        });
    }
    static get() {
        if (instance)
            return instance.loggerInstance;
        const logger = new LogService();
        logger.create();
        instance = logger;
        return instance.loggerInstance;
    }
}
exports.LogService = LogService;
//# sourceMappingURL=LogService.js.map