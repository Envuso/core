import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(relativeTime);

export class DateTime {
	private _date: dayjs.Dayjs;

	constructor(date?: string) {
		this._date = dayjs(date);
	}

	static now(): dayjs.Dayjs {
		return new this()._date;
	}

	static parse(date: string): dayjs.Dayjs {
		return new this(date)._date;
	}

}
