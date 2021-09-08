import LogService from "./LogService";

export class Log {
	private static enabled: boolean = true;
	private labels: Set<string> = new Set();

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

	label(...label: string[]) {
		for (const l of label) {
			this.labels.add(l.toUpperCase().trim());
		}

		return this;
	}

	static label(...label: string[]) {
		return new this().label(...label);
	}

	log(level, message, ...args) {
		if (Log.isLoggingDisabled())
			return;

		LogService.get().log(level, message, [...this.labels], ...args);
	}

	static log(level, message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().log(level, message, undefined, ...args);
	}

	success(message, ...args) {
		this.log("success", message, ...args);
	}

	static success(message, ...args) {
		this.log("success", message, ...args);
	}

	warn(message, ...args) {
		this.log("warn", message, ...args);
	}

	static warn(message, ...args) {
		this.log("warn", message, ...args);
	}

	error(message: string | Error, error?: Error, ...args) {
		if (error instanceof Error) {
			args.unshift(error);
		}

		this.log("error", message, ...args);
	}

	static error(message: string | Error, error?: Error, ...args) {
		if (error instanceof Error) {
			args.unshift(error);
		}

		this.log("error", message, ...args);
	}

	exception(message: string | Error, error?: Error) {
		this.error(message, error);
	}

	static exception(message: string | Error, error?: Error) {
		this.error(message, error);
	}

	info(message: string | Error, ...args) {
		this.log("info", message, ...args);
	}

	static info(message, ...args) {
		this.log("info", message, ...args);
	}

	debug(message, ...args) {
		this.log("debug", message, ...args);
	}

	static debug(message, ...args) {
		this.log("debug", message, ...args);
	}
}

export default Log;
