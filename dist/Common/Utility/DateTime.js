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
    /**
     * Get the dayjs instance
     *
     * @returns {dayjs.Dayjs}
     */
    get() {
        return this._date;
    }
    /**
     * Get a DayJS instance for the current date/time
     *
     * @returns {DateTime}
     */
    static now() {
        return new this();
    }
    /**
     * Parse a date type and return a DayJS instance
     *
     * @param {dayjs.ConfigType} date
     * @returns {dayjs.Dayjs}
     */
    static parse(date) {
        return new this(date)._date;
    }
    /**
     * Parse a date type and return a DateTime instance
     *
     *
     * @param {dayjs.ConfigType} date
     * @returns {dayjs.Dayjs}
     */
    static create(date) {
        return new this(date);
    }
    /**
     * Get the difference in seconds between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInSeconds(date) {
        if (!(date instanceof DateTime)) {
            date = new this(date);
        }
        return this.now().get().diff(date.get(), 'seconds');
    }
    /**
     * Get the difference in minutes between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInMinutes(date) {
        if (!(date instanceof DateTime)) {
            date = new this(date);
        }
        return this.now().get().diff(date.get(), 'minutes');
    }
    /**
     * Get the difference in hours between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInHours(date) {
        if (!(date instanceof DateTime)) {
            date = new this(date);
        }
        return this.now().get().diff(date.get(), 'hours');
    }
    /**
     * Get the difference in days between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInDays(date) {
        if (!(date instanceof DateTime)) {
            date = new this(date);
        }
        return this.now().get().diff(date.get(), 'days');
    }
    /**
     * Add x seconds to the time
     *
     * @param {number} seconds
     * @returns {this}
     */
    addSeconds(seconds) {
        this._date = this._date.add(seconds, 'seconds');
        return this;
    }
    /**
     * Add x minutes to the time
     *
     * @param {number} minutes
     * @returns {this}
     */
    addMinutes(minutes) {
        this._date = this._date.add(minutes, 'minutes');
        return this;
    }
    /**
     * Add x hours to the time
     *
     * @param {number} hours
     * @returns {this}
     */
    addHours(hours) {
        this._date = this._date.add(hours, 'hours');
        return this;
    }
    /**
     * Add x days to the time
     *
     * @param {number} days
     * @returns {this}
     */
    addDays(days) {
        this._date = this._date.add(days, 'days');
        return this;
    }
    /**
     * Add x weeks to the time
     *
     * @param {number} weeks
     * @returns {this}
     */
    addWeeks(weeks) {
        this._date = this._date.add(weeks, 'weeks');
        return this;
    }
    /**
     * Add x months to the time
     *
     * @param {number} months
     * @returns {this}
     */
    addMonths(months) {
        this._date = this._date.add(months, 'months');
        return this;
    }
    /**
     * Add x years to the time
     *
     * @param {number} years
     * @returns {this}
     */
    addYears(years) {
        this._date = this._date.add(years, 'years');
        return this;
    }
    /**
     * Sub x seconds from the time
     *
     * @param {number} seconds
     * @returns {this}
     */
    subSeconds(seconds) {
        this._date = this._date.subtract(seconds, 'seconds');
        return this;
    }
    /**
     * Sub x minutes from the time
     *
     * @param {number} minutes
     * @returns {this}
     */
    subMinutes(minutes) {
        this._date = this._date.subtract(minutes, 'minutes');
        return this;
    }
    /**
     * Sub x hours from the time
     *
     * @param {number} hours
     * @returns {this}
     */
    subHours(hours) {
        this._date = this._date.subtract(hours, 'hours');
        return this;
    }
    /**
     * Sub x days from the time
     *
     * @param {number} days
     * @returns {this}
     */
    subDays(days) {
        this._date = this._date.subtract(days, 'days');
        return this;
    }
    /**
     * Sub x weeks from the time
     *
     * @param {number} weeks
     * @returns {this}
     */
    subWeeks(weeks) {
        this._date = this._date.subtract(weeks, 'weeks');
        return this;
    }
    /**
     * Sub x months from the time
     *
     * @param {number} months
     * @returns {this}
     */
    subMonths(months) {
        this._date = this._date.subtract(months, 'months');
        return this;
    }
    /**
     * Sub x years from the time
     *
     * @param {number} years
     * @returns {this}
     */
    subYears(years) {
        this._date = this._date.subtract(years, 'years');
        return this;
    }
    unix() {
        return this._date.unix();
    }
    daysInMonth() {
        return this._date.daysInMonth();
    }
    toDate() {
        return this._date.toDate();
    }
    toJSON() {
        return this._date.toJSON();
    }
    toISOString() {
        return this._date.toISOString();
    }
    toString() {
        return this._date.toString();
    }
    utcOffset() {
        return this._date.utcOffset();
    }
}
exports.DateTime = DateTime;
//# sourceMappingURL=DateTime.js.map