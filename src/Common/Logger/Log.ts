import {LogService} from "./LogService";


export class Log {

	static isLoggingDisabled(): boolean {
		//@ts-ignore
		return !!global.disableConsoleLogs;
	}

	static log(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().log('log', message, {...args});
	}

	static success(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().log('success', message, {...args});
	}

	static warn(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().warn(message, {...args});
	}

	static error(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().error(message, {...args});
	}

	static exception(message, error: Error) {
		if(this.isLoggingDisabled())
			return;

		LogService.get().error(message, error);
	}

	static info(message, ...args) {
		if (this.isLoggingDisabled())
			return;

		LogService.get().info(message, {...args});
	}

}
