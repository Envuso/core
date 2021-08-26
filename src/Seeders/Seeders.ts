import {DatabaseSeeder} from "../Database/Seeder/DatabaseSeeder";
import {UserSeeder} from "./UserSeeder";

export class Seeders extends DatabaseSeeder {

	public registerSeeders() {
		this.add(UserSeeder);
	}

}
