import {resolve} from "../../AppContainer";
import {DatabaseSeederContract} from "../../Contracts/Database/Seeder/DatabaseSeederContract";
import {SeederContract} from "../../Contracts/Database/Seeder/SeederContract";
import {SeedManagerContract} from "../../Contracts/Database/Seeder/SeedManagerContract";
import {SeedManager} from "./SeedManager";

export abstract class DatabaseSeeder implements DatabaseSeederContract {

	public manager: SeedManagerContract;

	constructor() {
		this.manager = resolve(SeedManager);
	}

	public add(seeder: new () => SeederContract) {
		this.manager.registerSeeder(seeder);
	}

	public abstract registerSeeders();

}
