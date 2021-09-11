import dayjs, {ConfigType, Dayjs} from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import {DateJsOrDateTime, DateTimeContract} from "../../Contracts/Common/Utility/DateTimeContract";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(relativeTime);


export class DateTime implements DateTimeContract {
	public _date: dayjs.Dayjs;

	constructor(date?: DateJsOrDateTime) {
		if(date instanceof DateTime) {
			this._date = date.get();
		} else {
			this._date = dayjs(date as dayjs.ConfigType);
		}
	}

	/**
	 * Get the dayjs instance
	 *
	 * @returns {dayjs.Dayjs}
	 */
	public get(): dayjs.Dayjs {
		return this._date;
	}

	/**
	 * Get a DayJS instance for the current date/time
	 *
	 * @returns {DateTime}
	 */
	static now(): DateTime {
		return new this();
	}

	/**
	 * Parse a date type and return a DayJS instance
	 *
	 * @param {dayjs.ConfigType} date
	 * @returns {dayjs.Dayjs}
	 */
	static parse(date: dayjs.ConfigType): DateTime {
		return new this(date);
	}

	/**
	 * Parse a date type and return a DateTime instance
	 *
	 * @param {dayjs.ConfigType} date
	 *
	 * @returns {DateTimeContract}
	 */
	static create(date: dayjs.ConfigType): DateTimeContract {
		return new this(date);
	}

	/**
	 * Get the difference in seconds between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	static diffInSeconds(date: DateJsOrDateTime): number {
		if (!(date instanceof DateTime)) {
			date = new this(date);
		}

		return Math.abs(this.now().get().diff(date.get(), "seconds"));
	}

	/**
	 * Get the difference in seconds between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	public diffInSeconds(date: DateJsOrDateTime) {
		return DateTime.diffInSeconds(date);
	}

	/**
	 * Get the difference in minutes between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	static diffInMinutes(date: DateJsOrDateTime): number {
		if (!(date instanceof DateTime)) {
			date = new this(date);
		}

		return Math.abs(this.now().get().diff(date.get(), "minutes"));
	}

	/**
	 * Get the difference in minutes between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	public diffInMinutes(date: DateJsOrDateTime) {
		return DateTime.diffInMinutes(date);
	}

	/**
	 * Get the difference in hours between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	static diffInHours(date: DateJsOrDateTime): number {
		if (!(date instanceof DateTime)) {
			date = new this(date);
		}

		return Math.abs(this.now().get().diff(date.get(), "hours"));
	}

	/**
	 * Get the difference in hours between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	public diffInHours(date: DateJsOrDateTime) {
		return DateTime.diffInHours(date);
	}

	/**
	 * Get the difference in days between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	static diffInDays(date: DateJsOrDateTime): number {
		if (!(date instanceof DateTime)) {
			date = new this(date);
		}

		return Math.abs(this.now().get().diff(date.get(), "days"));
	}

	/**
	 * Get the difference in days between now and x date.
	 *
	 * @param {DateJsOrDateTime} date
	 * @returns {number}
	 */
	public diffInDays(date: DateJsOrDateTime) {
		return DateTime.diffInDays(date);
	}

	/**
	 * Add x seconds to the time
	 *
	 * @param {number} seconds
	 * @returns {this}
	 */
	public addSeconds(seconds: number) {
		this._date = this._date.add(seconds, 'seconds');

		return this;
	}

	/**
	 * Add x minutes to the time
	 *
	 * @param {number} minutes
	 * @returns {this}
	 */
	public addMinutes(minutes: number) {
		this._date = this._date.add(minutes, 'minutes');

		return this;
	}

	/**
	 * Add x hours to the time
	 *
	 * @param {number} hours
	 * @returns {this}
	 */
	public addHours(hours: number) {
		this._date = this._date.add(hours, 'hours');

		return this;
	}

	/**
	 * Add x days to the time
	 *
	 * @param {number} days
	 * @returns {this}
	 */
	public addDays(days: number) {
		this._date = this._date.add(days, 'days');

		return this;
	}

	/**
	 * Add x weeks to the time
	 *
	 * @param {number} weeks
	 * @returns {this}
	 */
	public addWeeks(weeks: number) {
		this._date = this._date.add(weeks, 'weeks');

		return this;
	}

	/**
	 * Add x months to the time
	 *
	 * @param {number} months
	 * @returns {this}
	 */
	public addMonths(months: number) {
		this._date = this._date.add(months, 'months');

		return this;
	}

	/**
	 * Add x years to the time
	 *
	 * @param {number} years
	 * @returns {this}
	 */
	public addYears(years: number) {
		this._date = this._date.add(years, 'years');

		return this;
	}

	/**
	 * Sub x seconds from the time
	 *
	 * @param {number} seconds
	 * @returns {this}
	 */
	public subSeconds(seconds: number) {
		this._date = this._date.subtract(seconds, 'seconds');

		return this;
	}

	/**
	 * Sub x minutes from the time
	 *
	 * @param {number} minutes
	 * @returns {this}
	 */
	public subMinutes(minutes: number) {
		this._date = this._date.subtract(minutes, 'minutes');

		return this;
	}

	/**
	 * Sub x hours from the time
	 *
	 * @param {number} hours
	 * @returns {this}
	 */
	public subHours(hours: number) {
		this._date = this._date.subtract(hours, 'hours');

		return this;
	}

	/**
	 * Sub x days from the time
	 *
	 * @param {number} days
	 * @returns {this}
	 */
	public subDays(days: number) {
		this._date = this._date.subtract(days, 'days');

		return this;
	}

	/**
	 * Sub x weeks from the time
	 *
	 * @param {number} weeks
	 * @returns {this}
	 */
	public subWeeks(weeks: number) {
		this._date = this._date.subtract(weeks, 'weeks');

		return this;
	}

	/**
	 * Sub x months from the time
	 *
	 * @param {number} months
	 * @returns {this}
	 */
	public subMonths(months: number) {
		this._date = this._date.subtract(months, 'months');

		return this;
	}

	/**
	 * Sub x years from the time
	 *
	 * @param {number} years
	 * @returns {this}
	 */
	public subYears(years: number) {
		this._date = this._date.subtract(years, 'years');

		return this;
	}


	public unix(): number {
		return this._date.unix();
	}

	public daysInMonth(): number {
		return this._date.daysInMonth();
	}

	public toTime(): number {
		return this._date.toDate().getTime();
	}

	public toDate(): Date {
		return this._date.toDate();
	}

	public toJSON(): string {
		return this._date.toJSON();
	}

	public toISOString(): string {
		return this._date.toISOString();
	}

	public toString(): string {
		return this._date.toString();
	}

	public utcOffset(): number {
		return this._date.utcOffset();
	}
}
