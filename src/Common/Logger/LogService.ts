import chalk from "chalk";
import {createLogger, format, Logger, transports} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const {combine, timestamp, label, prettyPrint, printf, colorize, cli, ms, errors} = format;


let instance = null;

export class LogService {

	loggerInstance: Logger = null;

	create() {
		const rotateFile = new DailyRotateFile({
			dirname       : "./storage/logs",
			filename      : "%DATE%-app.log",
			format        : combine(
				format.timestamp({format : 'M/D HH:mm:ss.SSS'}),
				format.ms(),
				printf(({level, message, label, ms, timestamp, ...metadata}) => {
					if (ms) {
						if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
							ms = `${ms}`;
						} else {
							ms = `${ms}`;
						}
					}
					let msg = `[${timestamp}][${level} ${ms}] : ${message}`;

					if (metadata && Object.keys(metadata).length) {
						try {
							msg += '\n';
							msg += JSON.stringify(metadata, null, "    ");
						} catch (error) {

						}
					}

					return msg;
				})
			),
			zippedArchive : true,
			maxSize       : "20m",
			maxFiles      : "14d"
		});

		const myFormat = printf(({level, message, label, ms, timestamp, stack, ...metadata}) => {
			if (ms) {
				if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
					ms = chalk.redBright`${ms}`;
				} else {
					ms = chalk.greenBright`${ms}`;
				}
			}

			timestamp = chalk.gray(`[${timestamp}]`);

			let levelColor   = chalk.white;
			let messageColor = chalk.white;

			switch (level) {
				case 'log':
					levelColor = chalk.bgGray.whiteBright.bold;
					break;
				case 'warn':
					levelColor = chalk.bgYellow.whiteBright.bold;
					break;
				case 'error':
					levelColor = chalk.bgRed.whiteBright.bold;
					break;
				case 'success':
					levelColor = chalk.bgGreen.whiteBright.bold;
					break;
				case 'info':
					levelColor = chalk.bgBlue.whiteBright.bold;
					break;
			}
			switch (level) {
				case 'log':
					messageColor = chalk.gray;
					break;
				case 'warn':
					messageColor = chalk.yellow;
					break;
				case 'error':
					messageColor = chalk.red;
					break;
				case 'success':
					messageColor = chalk.green;
					break;
				case 'info':
					messageColor = chalk.blue;
					break;
			}

			level           = levelColor` ${level.toUpperCase()} `;
			const levelWrap = chalk.gray`${level}`;
			message         = messageColor`${message}`;

			let msg = `${timestamp} ${levelWrap} ${message} ${ms}`;

			if (metadata && Object.keys(metadata).length) {
				try {
					msg += '\n';
					msg += JSON.stringify(metadata, null, "    ");
				} catch (error) {

				}
			}

			if (stack) {
				message += `\n`;
				message += stack;
			}

			return msg;
		});

		const cliTransport = new transports.Console({
			handleExceptions : true,
			format           : combine(
				errors({stack : true}),
				format.timestamp({format : 'HH:mm:ss'}),
				ms(),
				myFormat,
				//format.align(),
			),
		});

		this.loggerInstance = createLogger({
			levels            : {
				debug   : 0,
				success : 1,
				info    : 2,
				warn    : 3,
				error   : 4
			},
			level             : 'error',
			exitOnError       : false,
			handleExceptions  : false,
			exceptionHandlers : [
				cliTransport,
				rotateFile
			],
			transports        : [
				cliTransport,
				rotateFile
			]
		});
	}

	static get(): Logger {
		if (instance) return instance.loggerInstance;

		const logger = new LogService();
		logger.create();

		instance = logger;

		return instance.loggerInstance;
	}
}
