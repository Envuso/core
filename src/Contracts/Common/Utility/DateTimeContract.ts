import dayjs, {Dayjs} from "dayjs";
import {DateTimeComparisonType} from "../../../Common";

export type DateJsOrDateTime = string | number | Date | Dayjs | DateTimeContract;

export interface DateTimeContract {
	_date: dayjs.Dayjs;

	/**
	 * Get the dayjs instance
	 *
	 * @returns {dayjs.Dayjs}
	 */
	get(): dayjs.Dayjs;

	/**
	 * Get the difference in seconds between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	diffInSeconds(date: DateJsOrDateTime): any;

	/**
	 * Get the difference in minutes between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	diffInMinutes(date: DateJsOrDateTime): any;

	/**
	 * Get the difference in hours between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	diffInHours(date: DateJsOrDateTime): any;

	/**
	 * Get the difference in days between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	diffInDays(date: DateJsOrDateTime): any;

	/**
	 * Add x seconds to the time
	 *
	 * @param {number} seconds
	 * @returns {DateTimeContract}
	 */
	addSeconds(seconds: number): DateTimeContract;

	/**
	 * Add x minutes to the time
	 *
	 * @param {number} minutes
	 * @returns {DateTimeContract}
	 */
	addMinutes(minutes: number): DateTimeContract;

	/**
	 * Add x hours to the time
	 *
	 * @param {number} hours
	 * @returns {DateTimeContract}
	 */
	addHours(hours: number): DateTimeContract;

	/**
	 * Add x days to the time
	 *
	 * @param {number} days
	 * @returns {DateTimeContract}
	 */
	addDays(days: number): DateTimeContract;

	/**
	 * Add x weeks to the time
	 *
	 * @param {number} weeks
	 * @returns {DateTimeContract}
	 */
	addWeeks(weeks: number): DateTimeContract;

	/**
	 * Add x months to the time
	 *
	 * @param {number} months
	 * @returns {DateTimeContract}
	 */
	addMonths(months: number): DateTimeContract;

	/**
	 * Add x years to the time
	 *
	 * @param {number} years
	 * @returns {DateTimeContract}
	 */
	addYears(years: number): DateTimeContract;

	/**
	 * Sub x seconds from the time
	 *
	 * @param {number} seconds
	 * @returns {DateTimeContract}
	 */
	subSeconds(seconds: number): DateTimeContract;

	/**
	 * Sub x minutes from the time
	 *
	 * @param {number} minutes
	 * @returns {DateTimeContract}
	 */
	subMinutes(minutes: number): DateTimeContract;

	/**
	 * Sub x hours from the time
	 *
	 * @param {number} hours
	 * @returns {DateTimeContract}
	 */
	subHours(hours: number): DateTimeContract;

	/**
	 * Sub x days from the time
	 *
	 * @param {number} days
	 * @returns {DateTimeContract}
	 */
	subDays(days: number): DateTimeContract;

	/**
	 * Sub x weeks from the time
	 *
	 * @param {number} weeks
	 * @returns {DateTimeContract}
	 */
	subWeeks(weeks: number): DateTimeContract;

	/**
	 * Sub x months from the time
	 *
	 * @param {number} months
	 * @returns {DateTimeContract}
	 */
	subMonths(months: number): DateTimeContract;

	/**
	 * Sub x years from the time
	 *
	 * @param {number} years
	 * @returns {DateTimeContract}
	 */
	subYears(years: number): DateTimeContract;

	diffForHumans(
		otherDate?: DateTimeContract,
		comparisonType?: DateTimeComparisonType,
		withoutSuffix?: boolean,
	): string;

	unix(): number;

	daysInMonth(): number;

	toTime(): number;

	toDate(): Date;

	toJSON(): string;

	toISOString(): string;

	toString(): string;

	utcOffset(): number;
}
