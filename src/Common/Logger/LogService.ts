import chalk from "chalk";
import {createLogger, format, transports, Logger} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import {Str} from "../Utility/Str";

const {combine, timestamp, printf, ms, errors} = format;

export class LogService {
	private static instance: LogService;
	private logInstance: Logger;
	private colors: Object = {
		warn    : {
			level   : chalk.bgYellow.whiteBright.bold,
			message : chalk.yellow,
		},
		error   : {
			level   : chalk.bgRed.whiteBright.bold,
			message : chalk.red,
		},
		success : {
			level   : chalk.bgGreen.whiteBright.bold,
			message : chalk.green,
		},
		info    : {
			level   : chalk.bgBlue.whiteBright.bold,
			message : chalk.blue,
		},
		debug   : {
			level   : chalk.bgGray.whiteBright.bold,
			message : chalk.white,
		},
	};

	constructor() {
		LogService.instance = this;

		this.createInstance();
	}

	static get(): LogService {
		if (!this.instance) {
			new LogService();
		}

		return this.instance;
	}

	log(level, message, labels = [], ...args) {
		this.logInstance.log({
			level,
			message,
			meta : {
				labels,
				args,
			},
		});
	}

	private createInstance() {
		const fileTransport = this.createFileTransport();
		const consoleTransport = this.createConsoleTransport();

		this.logInstance = createLogger({
			levels            : {
				debug   : 0,
				success : 1,
				info    : 2,
				warn    : 3,
				error   : 4,
			},
			level             : "error",
			exitOnError       : false,
			handleExceptions  : false,
			exceptionHandlers : [
				fileTransport,
				consoleTransport,
			],
			transports        : [
				fileTransport,
				consoleTransport,
			],
		});
	}

	private createConsoleTransport() {
		return new transports.Console({
			level            : "error",
			handleExceptions : true,
			format           : combine(
				errors({stack : true}),
				timestamp({format : "HH:mm:ss"}),
				ms(),
				printf(this.formatMessage.bind(this)),
				// align()
			),
		});
	}

	private createFileTransport() {
		return new DailyRotateFile({
			dirname       : "./storage/logs",
			filename      : "%DATE%-app.log",
			level         : "error",
			format        : combine(
				timestamp({format : "YYYY-MM-DDTHH:mm:ss.SSSZ"}), // ISO Format
				ms(),
				printf(this.formatSimpleMessage.bind(this)),
			),
			zippedArchive : true,
			maxSize       : "20m",
			maxFiles      : "14d",
		});
	}

	private formatMessage({level, stack, message, ms, timestamp, meta}) {
		const color = this.colors[level];

		timestamp = chalk.grey(`[${timestamp}]`);
		level     = color.level(` ${level.toUpperCase()} `);

		const levelWrap    = chalk.grey(level);
		const labels       = (meta.labels.length > 0 ? "[" + meta.labels.join("] [") + "]" : "");
		let messagePostfix = "";

		// If you call Log.error(Error, Error), the Error in the 2nd argument will not be displayed.
		if (!stack && meta.args[0] instanceof Error) {
			// If Log.error is called with Log.error(string, Error), then we append the stack from the error onto the message
			stack = meta.args.shift().stack;
		}

		// Use a slightly different format when an Error is logged so it's a little nicer 🙂
		if (stack) {
			// Take the first line of the stack (the message) and make it pop 😎
			stack          = stack.split("\n");
			message        = (labels + " " + color.message(stack.shift())).trim();
			messagePostfix = stack.join("\n");
		} else {
			message = (labels + " " + color.message(message)).trim();
		}

		// Ensure any optional arguments passed in to the log function are kept even if we're outputting an Error
		messagePostfix += meta.args.map(arg => JSON.stringify(arg, null, 4)).join(" ");

		if (!Str.isEmpty(messagePostfix)) {
			messagePostfix = "\n" + messagePostfix;
		}

		return `${timestamp} ${levelWrap} ${message} ${this.formatMs(ms)}${messagePostfix}`;
	}

	private formatMs(msString: string) {
		const char = msString.slice(0, 1);
		const ms   = Number(msString.slice(1).replace('ms', ''));

		let formatted = `${char}${ms}ms`;

		switch (true) {
			case ms >= 250:
				formatted = chalk.red.bold(formatted);
				break;
			case ms >= 100:
				formatted = chalk.yellow.bold(formatted);
				break;
			default:
				formatted = chalk.green.bold(formatted);
				break;
		}

		return formatted;
	}

	/**
	 * Same as the formatMessage function but doesn't have any of the color stuff.
	 *
	 */
	private formatSimpleMessage({level, stack, message, ms, timestamp, meta}) {
		const labels       = (meta.labels.length > 0 ? "[" + meta.labels.join("] [") + "]" : "");
		let messagePostfix = "";

		// If you call Log.error(Error, Error), the Error in the 2nd argument will not be displayed.
		if (!stack && meta.args[0] instanceof Error) {
			// If Log.error is called with Log.error(string, Error), then we append the stack from the error onto the message
			stack = meta.args.shift().stack;
		}

		// Use a slightly different format when an Error is logged so it's a little nicer 🙂
		if (stack) {
			// Take the first line of the stack (the message) and make it pop 😎
			stack          = stack.split("\n");
			message        = (labels + " " + stack.shift()).trim();
			messagePostfix = stack.join("\n");
		} else {
			message = (labels + " " + message).trim();
		}

		// Ensure any optional arguments passed in to the log function are kept even if we're outputting an Error
		messagePostfix += meta.args.map(arg => JSON.stringify(arg, null, 4)).join(" ");

		if (!Str.isEmpty(messagePostfix)) {
			messagePostfix = "\n" + messagePostfix;
		}

		return `${timestamp} ${level} ${message} ${this.formatMs(ms)}${messagePostfix}`;
	}
}

export default LogService;
