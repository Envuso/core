"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Seeders_1 = require("../Seeders/Seeders");
exports.default = {
    mongo: {
        name: 'test',
        url: 'mongodb://127.0.0.1:27017',
        clientOptions: {
            ssl: false,
            readPreference: "primaryPreferred",
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    redis: {
        /**
         * Set this to false to disable redis integration
         */
        enabled: true,
        prefix: 'envuso-',
        //		db     : 'default',
        host: '127.0.0.1',
        port: 6379,
    },
    /**
     * Your user defined seeder manager
     * This is where you will register all of your seeder instances
     * They will all be looped through and seeded.
     */
    seeder: Seeders_1.Seeders
};
//# sourceMappingURL=Database.js.map