"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const __1 = require("../");
const Auth_1 = __importDefault(require("./Auth"));
const Database_1 = __importDefault(require("./Database"));
const Server_1 = __importDefault(require("./Server"));
const Session_1 = __importDefault(require("./Session"));
const Storage_1 = __importDefault(require("./Storage"));
const Websockets_1 = __importDefault(require("./Websockets"));
exports.Config = {
    app: {
        appKey: '1234',
        providers: [
            __1.DatabaseServiceProvider,
            __1.CacheServiceProvider,
            __1.EncryptionServiceProvider,
            __1.AuthenticationServiceProvider,
            __1.RouteServiceProvider,
            __1.StorageServiceProvider,
            __1.ServerServiceProvider,
        ]
    },
    auth: Auth_1.default,
    database: Database_1.default,
    storage: Storage_1.default,
    server: Server_1.default,
    session: Session_1.default,
    websockets: Websockets_1.default
};
//# sourceMappingURL=index.js.map