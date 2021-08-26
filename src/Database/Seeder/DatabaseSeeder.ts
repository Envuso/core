import {resolve} from "../../AppContainer";
import {Seeder} from "./Seeder";
import {SeedManager} from "./SeedManager";

export abstract class DatabaseSeeder {

	private manager: SeedManager;

	constructor() {
		this.manager = resolve(SeedManager);
	}

	public add(seeder: new () => Seeder) {
		this.manager.registerSeeder(seeder);
	}

	abstract registerSeeders();

}
