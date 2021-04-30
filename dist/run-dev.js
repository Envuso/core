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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: path_1.default.join(__dirname, '..', '..', 'Components', '.env') });
const Config_1 = require("./Config");
const Routing_1 = require("./Routing");
const Envuso_1 = require("./Envuso");
const Common_1 = require("./Common");
const envuso = new Envuso_1.Envuso();
envuso.prepare(Config_1.Config)
    .then(() => {
    envuso.addExceptionHandler((exception, request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        Common_1.Log.exception('Server error: ', exception);
        return Routing_1.response().json(exception instanceof Common_1.Exception ? exception.response : exception);
    }));
})
    .catch(error => {
    Common_1.Log.error(error);
    console.trace(error);
});
//# sourceMappingURL=run-dev.js.map