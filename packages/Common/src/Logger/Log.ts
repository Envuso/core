import {LogService} from "./LogService";


export class Log {

	static log(message, ...args) {
		//@ts-ignore
		if (global.disableConsoleLogs) {
			return;
		}

		LogService.get().log('log', message, {...args});
	}

	static success(message, ...args) {
		//@ts-ignore
		if (global.disableConsoleLogs) {
			return;
		}

		LogService.get().log('success', message, {...args});
	}

	static warn(message, ...args) {
		//@ts-ignore
		if (global.disableConsoleLogs) {
			return;
		}

		LogService.get().warn(message, {...args});
	}

	static error(message, ...args) {
		//@ts-ignore
		if (global.disableConsoleLogs) {
			return;
		}

		LogService.get().error(message, {...args});
	}

	static info(message, ...args) {
		//@ts-ignore
		if (global.disableConsoleLogs) {
			return;
		}

		LogService.get().info(message, {...args});
	}

}
