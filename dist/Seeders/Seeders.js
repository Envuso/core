"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeders = void 0;
const DatabaseSeeder_1 = require("../Database/Seeder/DatabaseSeeder");
const UserSeeder_1 = require("./UserSeeder");
class Seeders extends DatabaseSeeder_1.DatabaseSeeder {
    registerSeeders() {
        this.add(UserSeeder_1.UserSeeder);
    }
}
exports.Seeders = Seeders;
//# sourceMappingURL=Seeders.js.map