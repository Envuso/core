import {SeedManager} from "../../../Database/Seeder/SeedManager";
import type {SeederContract} from "./SeederContract";

export interface DatabaseSeederContract {
	manager: SeedManager;

	add(seeder: new () => SeederContract): void;

	registerSeeders(): any;
}
