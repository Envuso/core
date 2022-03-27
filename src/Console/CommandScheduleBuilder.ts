interface CronSchedule {
	second: string | number;
	minute: string | number;
	hour: string | number;
	dayOfMonth: string | number;
	month: string | number;
	dayOfWeek: string | number;
}

export class CommandScheduleBuilder {

	//	private _schedule: CronSchedule = {
	//		second     : -1,
	//		minute     : -1,
	//		hour       : -1,
	//		dayOfMonth : -1,
	//		month      : -1,
	//		dayOfWeek  : -1,
	//	};

	private _schedule: string = null;

	everyHour(hour: number = 0) {
		let hourStr = '0';
		if (hour > 0) {
			hourStr = '*/' + hour;
		}

		this._schedule = hourStr + ' * * * *';
	}


	everyMinute(minute: number = 0) {
		let minuteStr = '0';
		if (minute > 0) {
			minuteStr = '*/' + minute;
		} else {
			minuteStr = '*';
		}

		this._schedule = minute + ' * * * *';
	}

	everySecond() {
		this._schedule = '* * * * * *';
	}

	getCronTab() {
		return this._schedule;
	}

}
