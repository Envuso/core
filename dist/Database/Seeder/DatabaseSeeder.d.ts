import { Seeder } from "./Seeder";
export declare abstract class DatabaseSeeder {
    private manager;
    constructor();
    add(seeder: new () => Seeder): void;
    abstract registerSeeders(): any;
}
