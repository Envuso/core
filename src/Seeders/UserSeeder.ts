import {Seeder} from "../Database";

export class UserSeeder extends Seeder {
	public async seed(): Promise<any> {
		console.log('hi from user seeder');
	}

}
