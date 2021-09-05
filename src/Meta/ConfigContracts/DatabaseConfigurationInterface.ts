import { MongoConnectionConfiguration, RedisConnectionConfiguration } from "../../Contracts/Configuration/DatabaseConfigurationContracts";

export interface DatabaseConfigurationInterface {
    mongo: MongoConnectionConfiguration;
    redis: RedisConnectionConfiguration;
    /**
     * Your user defined seeder manager
     * This is where you will register all of your seeder instances
     * They will all be looped through and seeded.
     */
    seeder: any;
}
