import dayjs, { Dayjs } from "dayjs";
declare type DateJsOrDateTime = string | number | Date | Dayjs | DateTime;
export declare class DateTime {
    private _date;
    constructor(date?: dayjs.ConfigType);
    /**
     * Get the dayjs instance
     *
     * @returns {dayjs.Dayjs}
     */
    get(): dayjs.Dayjs;
    /**
     * Get a DayJS instance for the current date/time
     *
     * @returns {DateTime}
     */
    static now(): DateTime;
    /**
     * Parse a date type and return a DayJS instance
     *
     * @param {dayjs.ConfigType} date
     * @returns {dayjs.Dayjs}
     */
    static parse(date: dayjs.ConfigType): dayjs.Dayjs;
    /**
     * Parse a date type and return a DateTime instance
     *
     *
     * @param {dayjs.ConfigType} date
     * @returns {dayjs.Dayjs}
     */
    static create(date: dayjs.ConfigType): DateTime;
    /**
     * Get the difference in seconds between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInSeconds(date: DateJsOrDateTime): number;
    /**
     * Get the difference in minutes between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInMinutes(date: DateJsOrDateTime): number;
    /**
     * Get the difference in hours between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInHours(date: DateJsOrDateTime): number;
    /**
     * Get the difference in days between now and x date.
     *
     * @param {DateJsOrDateTime} date
     * @returns {number}
     */
    static diffInDays(date: DateJsOrDateTime): number;
    /**
     * Add x seconds to the time
     *
     * @param {number} seconds
     * @returns {this}
     */
    addSeconds(seconds: number): this;
    /**
     * Add x minutes to the time
     *
     * @param {number} minutes
     * @returns {this}
     */
    addMinutes(minutes: number): this;
    /**
     * Add x hours to the time
     *
     * @param {number} hours
     * @returns {this}
     */
    addHours(hours: number): this;
    /**
     * Add x days to the time
     *
     * @param {number} days
     * @returns {this}
     */
    addDays(days: number): this;
    /**
     * Add x weeks to the time
     *
     * @param {number} weeks
     * @returns {this}
     */
    addWeeks(weeks: number): this;
    /**
     * Add x months to the time
     *
     * @param {number} months
     * @returns {this}
     */
    addMonths(months: number): this;
    /**
     * Add x years to the time
     *
     * @param {number} years
     * @returns {this}
     */
    addYears(years: number): this;
    /**
     * Sub x seconds from the time
     *
     * @param {number} seconds
     * @returns {this}
     */
    subSeconds(seconds: number): this;
    /**
     * Sub x minutes from the time
     *
     * @param {number} minutes
     * @returns {this}
     */
    subMinutes(minutes: number): this;
    /**
     * Sub x hours from the time
     *
     * @param {number} hours
     * @returns {this}
     */
    subHours(hours: number): this;
    /**
     * Sub x days from the time
     *
     * @param {number} days
     * @returns {this}
     */
    subDays(days: number): this;
    /**
     * Sub x weeks from the time
     *
     * @param {number} weeks
     * @returns {this}
     */
    subWeeks(weeks: number): this;
    /**
     * Sub x months from the time
     *
     * @param {number} months
     * @returns {this}
     */
    subMonths(months: number): this;
    /**
     * Sub x years from the time
     *
     * @param {number} years
     * @returns {this}
     */
    subYears(years: number): this;
    unix(): number;
    daysInMonth(): number;
    toDate(): Date;
    toJSON(): string;
    toISOString(): string;
    toString(): string;
    utcOffset(): number;
}
export {};
