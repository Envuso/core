"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const AppContainer_1 = require("../../AppContainer");
const SeedManager_1 = require("./SeedManager");
class DatabaseSeeder {
    constructor() {
        this.manager = AppContainer_1.resolve(SeedManager_1.SeedManager);
    }
    add(seeder) {
        this.manager.registerSeeder(seeder);
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
//# sourceMappingURL=DatabaseSeeder.js.map