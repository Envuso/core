"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const DatabaseServiceProvider_1 = require("../src/DatabaseServiceProvider");
const Database_1 = __importDefault(require("./Database"));
exports.Config = {
    app: {
        providers: [
            DatabaseServiceProvider_1.DatabaseServiceProvider
        ]
    },
    database: Database_1.default
};
//# sourceMappingURL=index.js.map