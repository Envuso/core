"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
//@ts-ignore
global.disableConsoleLogs = true;
const dotenv_1 = require("dotenv");
dotenv_1.config();
const Config_1 = require("../Config");
const Database_1 = require("../Database");
const AppContainer_1 = require("../AppContainer");
const Envuso_1 = require("../Envuso");
const envuso = new Envuso_1.Envuso();
const yargs = require("yargs");
yargs.command('db:seed', 'Run the database seeders', (yargs) => {
}, (argv) => {
    envuso.initiateWithoutServing(Config_1.Config)
        .then(() => {
        const seederClass = AppContainer_1.config('database.seeder');
        const seeder = new seederClass();
        seeder.registerSeeders();
        return AppContainer_1.resolve(Database_1.SeedManager).runSeeders();
    })
        .then(() => process.exit())
        .catch(error => {
        console.error(error);
    });
});
yargs.parse();
//# sourceMappingURL=CliHandler.js.map