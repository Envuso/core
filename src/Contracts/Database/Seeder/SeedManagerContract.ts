import {SeederContract} from "./SeederContract";

export interface SeedManagerContract {
	seeders: (new () => SeederContract)[];

	/**
	 * Allow the user to register a seeder which will be run
	 *
	 * @param {T} seeder
	 */
	registerSeeder<T extends new () => SeederContract>(seeder: T): void;

	/**
	 * Run through all user defined seeders and run them
	 *
	 * @returns {Promise<void>}
	 */
	runSeeders(): Promise<void>;
}
