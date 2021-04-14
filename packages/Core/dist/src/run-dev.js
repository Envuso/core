"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: path_1.default.join(__dirname, '..', '..', 'Components', '.env') });
const common_1 = require("@envuso/common");
const index_1 = require("../Config/index");
const Envuso_1 = require("./Envuso");
const envuso = new Envuso_1.Envuso();
envuso.prepare({ config: index_1.Config }).catch(error => {
    common_1.Log.error(error);
    console.trace(error);
});
//# sourceMappingURL=run-dev.js.map