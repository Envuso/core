//import {LogService} from "./LogService";
import {appendFileSync} from "fs";
import {ILogObject, Logger} from "tslog";
import chalk from 'chalk';

export class Log {

	private static enabled: boolean    = true;
	private static logger: Logger      = null;
	private static errorLogger: Logger = null;

	private static getLogger(): Logger {
		if (this.logger === null) {
			function logToTransport(logObject: ILogObject) {
				appendFileSync(
					"./storage/logs/" + (new Date().toDateString()) + ".log",
					JSON.stringify(logObject, null, 2) + "\n"
				);
			}

			function logToErrorTransport(logObject: ILogObject) {
				appendFileSync(
					"./storage/logs/error." + (new Date().toDateString()) + ".log",
					JSON.stringify(logObject, null, 2) + "\n"
				);
			}

			this.logger = new Logger({
				name               : 'Envuso',
				type               : 'pretty',
				colorizePrettyLogs : true,
				//exposeStack: true,
				displayFilePath                         : "hidden",
				displayFunctionName                     : false,
				exposeErrorCodeFrame                    : true,
				exposeErrorCodeFrameLinesBeforeAndAfter : 10,
				overwriteConsole                        : true,
				displayTypes                            : true,
			});

			this.errorLogger = this.logger.getChildLogger({
				name        : 'Envuso Errors',
				exposeStack : true,
				displayFilePath                         : "displayAll",
				displayFunctionName                     : true,
			});
			this.errorLogger.attachTransport({
				silly : logToErrorTransport,
				debug : logToErrorTransport,
				trace : logToErrorTransport,
				info  : logToErrorTransport,
				warn  : logToErrorTransport,
				error : logToErrorTransport,
				fatal : logToErrorTransport,
			});
			this.logger.attachTransport({
				silly : logToTransport,
				debug : logToTransport,
				trace : logToTransport,
				info  : logToTransport,
				warn  : logToTransport,
				error : logToTransport,
				fatal : logToTransport,
			});
		}

		return this.logger;
	}

	static isLoggingDisabled(): boolean {
		return this.enabled === false;
	}

	static isLoggingEnabled(): boolean {
		return this.enabled === true;
	}

	static enable() {
		this.enabled = true;
	}

	static disable() {
		this.enabled = false;
	}

	static log(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		this.handleLog('debug', message, args);
		//		this.getLogger().silly(message, args)

		//LogService.get().log('log', message, {...args});
	}

	static success(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		this.handleLog('info', chalk.green(message), args);
		//		this.getLogger().info(chalk.green(message), args.length ? undefined : args)
		//		LogService.get().log('success', message, {...args});
	}

	static warn(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		this.handleLog('warn', message, args);
		//		this.getLogger().warn(message, args.length ? undefined : args);
		//		LogService.get().warn(message, {...args});
	}

	static error(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		this.handleLog('error', message, args);
		//		this.getLogger().error(message, args.length ? undefined : args);
		//		LogService.get().error(message, {...args});
	}

	static exception(message, error: Error) {
		if (this.isLoggingDisabled())
			return;
		this.getLogger();
		//		this.handleLog('error', message, args);
		this.handleLog('fatal', message, []);
		this.errorLogger.error(error);
		//		LogService.get().error(message, {error});
	}

	static info(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		this.handleLog('info', message, args);
		//		this.getLogger().info(message, args.length ? undefined : args);
		//		LogService.get().info(message, {...args});
	}

	private static handleLog(type: string, message, args) {
		if (args?.length) {
			if (args.length === 1) {
				args = args[0];
			}
			this.getLogger()[type](message, args);
			return;
		}
		this.getLogger()[type](message);
	}

}
