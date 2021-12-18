import {SeedManager} from "../../../Database";
import {SeederContract} from "./SeederContract";

export interface DatabaseSeederContract {
	manager: SeedManager;

	add(seeder: new () => SeederContract): void;

	registerSeeders(): any;
}
