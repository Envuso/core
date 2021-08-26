
import chalk from "chalk";
import {Seeder} from "./Seeder";

export class SeedManager {

	public seeders: (new () => Seeder)[] = [];

	/**
	 * Allow the user to register a seeder which will be run
	 *
	 * @param {T} seeder
	 */
	public registerSeeder<T extends new () => Seeder>(seeder: T) {
		this.seeders.push(seeder);
	}

	/**
	 * Run through all user defined seeders and run them
	 *
	 * @returns {Promise<void>}
	 */
	public async runSeeders() {
		const startTime = new Date().getTime();
		for await (let seeder of this.seeders) {
			const seederStartTime = new Date().getTime();

			const instance = new seeder();

			try {
				await instance.seed();
			} catch (error) {
				const seederFinishTime = new Date().getTime();
				console.error(chalk.red('Failed to seed ' + seeder.name + ', took ' + (seederFinishTime - seederStartTime) + 'ms'), error);
				continue;
			}

			const seederFinishTime = new Date().getTime();

			console.log(chalk.green('Successfully seeded ' + seeder.name + ' in ' + (seederFinishTime - seederStartTime) + 'ms'));
		}
		const endTime = new Date().getTime();

		console.log(chalk.green("Successfully run all seeders in " + (endTime - startTime) + "ms."));
	}

}
