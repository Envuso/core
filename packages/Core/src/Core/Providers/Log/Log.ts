import {LOGGER_IDENTIFIER} from "@Core/Container";
import {resolve} from "@Core/Helpers";
import {injectable} from "inversify";
import {Logger} from "winston";

@injectable()
export class Log {

	static log(message, ...args) {
		//@ts-ignore
		if(global.disableConsoleLogs){
			return;
		}
		resolve<Logger>(LOGGER_IDENTIFIER).log('log', message, {...args});
	}

	static success(message, ...args) {
		//@ts-ignore
		if(global.disableConsoleLogs){
			return;
		}
		resolve<Logger>(LOGGER_IDENTIFIER).log('success', message, {...args});
	}

	static warn(message, ...args) {
		//@ts-ignore
		if(global.disableConsoleLogs){
			return;
		}
		resolve<Logger>(LOGGER_IDENTIFIER).warn(message, {...args});
	}

	static error(message, ...args) {
		//@ts-ignore
		if(global.disableConsoleLogs){
			return;
		}
		resolve<Logger>(LOGGER_IDENTIFIER).error(message, {...args});
	}

	static info(message, ...args) {
		//@ts-ignore
		if(global.disableConsoleLogs){
			return;
		}
		resolve<Logger>(LOGGER_IDENTIFIER).info(message, {...args});
	}

}
