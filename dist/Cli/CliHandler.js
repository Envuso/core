"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
require("reflect-metadata");
//@ts-ignore
global.disableConsoleLogs = true;
const dotenv_1 = require("dotenv");
dotenv_1.config();
const Envuso_1 = require("../Envuso");
const AppContainer_1 = require("../AppContainer");
const Database_1 = require("../Database");
const envuso = new Envuso_1.Envuso();
const yargs = require("yargs");
const run = (dev = false) => {
    const config = dev ? require('./../Config') : require('../../../../dist/Config');
    yargs.command('db:seed', 'Run the database seeders. Seeders are defined in /src/Seeders/Seeders.ts.', (yargs) => {
    }, (argv) => {
        envuso.initiateWithoutServing(config)
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
    yargs.demandCommand(1);
    yargs.strict();
    yargs.parse();
};
exports.run = run;
//# sourceMappingURL=CliHandler.js.map