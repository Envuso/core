"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const App_1 = __importDefault(require("./App"));
const Auth_1 = __importDefault(require("./Auth"));
const Database_1 = __importDefault(require("./Database"));
const Server_1 = __importDefault(require("./Server"));
const Storage_1 = __importDefault(require("./Storage"));
exports.Config = {
    app: App_1.default,
    auth: Auth_1.default,
    database: Database_1.default,
    storage: Storage_1.default,
    server: Server_1.default
};
//# sourceMappingURL=index.js.map