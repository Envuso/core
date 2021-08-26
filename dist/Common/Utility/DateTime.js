"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(relativeTime_1.default);
class DateTime {
    constructor(date) {
        this._date = dayjs_1.default(date);
    }
    static now() {
        return new this()._date;
    }
    static parse(date) {
        return new this(date)._date;
    }
}
exports.DateTime = DateTime;
//# sourceMappingURL=DateTime.js.map