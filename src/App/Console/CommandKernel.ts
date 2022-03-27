import {Kernel} from "../../Console/Kernel";
import {TestingCommand} from "./Commands/TestingCommand";

export class CommandKernel extends Kernel {


	public registerSchedules() {
		this.schedule(TestingCommand).everySecond();
	}

}
