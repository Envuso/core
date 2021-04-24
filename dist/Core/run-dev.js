"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: path_1.default.join(__dirname, '..', '..', 'Components', '.env') });
const Config_1 = require("../Config");
const Envuso_1 = require("./Envuso");
const Common_1 = require("../Common");
const envuso = new Envuso_1.Envuso();
envuso.prepare(Config_1.Config).catch(error => {
    Common_1.Log.error(error);
    console.trace(error);
});
//# sourceMappingURL=run-dev.js.map