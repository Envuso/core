"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedManager = void 0;
const chalk_1 = __importDefault(require("chalk"));
class SeedManager {
    constructor() {
        this.seeders = [];
    }
    /**
     * Allow the user to register a seeder which will be run
     *
     * @param {T} seeder
     */
    registerSeeder(seeder) {
        this.seeders.push(seeder);
    }
    /**
     * Run through all user defined seeders and run them
     *
     * @returns {Promise<void>}
     */
    runSeeders() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                for (var _b = __asyncValues(this.seeders), _c; _c = yield _b.next(), !_c.done;) {
                    let seeder = _c.value;
                    const seederStartTime = new Date().getTime();
                    const instance = new seeder();
                    try {
                        yield instance.seed();
                    }
                    catch (error) {
                        const seederFinishTime = new Date().getTime();
                        console.error(chalk_1.default.red('Failed to seed ' + seeder.name + ', took ' + (seederFinishTime - seederStartTime) + 'ms'), error);
                        continue;
                    }
                    const seederFinishTime = new Date().getTime();
                    console.log(chalk_1.default.green('Successfully seeded ' + seeder.name + ' in ' + (seederFinishTime - seederStartTime) + 'ms'));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const endTime = new Date().getTime();
            console.log(chalk_1.default.green("Successfully run all seeders in " + (endTime - startTime) + "ms."));
        });
    }
}
exports.SeedManager = SeedManager;
//# sourceMappingURL=SeedManager.js.map