import {ClassConstructor} from "class-transformer";
import {Classes} from "../Common";
import {Command} from "./Command";
import {CommandScheduleBuilder} from "./CommandScheduleBuilder";

type CommandRegistration = { command: ClassConstructor<Command>, name: string, schedule: CommandScheduleBuilder }

export class Kernel {

	public commands: CommandRegistration[] = [];

	processCommand(args: any[]) {

	}

	registerSchedules() {

	}

	schedule<T extends Command>(command: ClassConstructor<T>): CommandScheduleBuilder {
		const reg: CommandRegistration = {
			name     : Classes.getConstructorName(command),
			command  : command,
			schedule : new CommandScheduleBuilder()
		};

		this.commands.push(reg);

		return reg.schedule;
	}
}
