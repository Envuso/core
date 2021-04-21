"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const tslib_1 = require("tslib");
const Core_1 = require("../Core");
const Database_1 = require("../Database");
const Routing_1 = require("../Routing");
const Authentication_1 = require("../Authentication");
const Storage_1 = require("../Storage");
const Auth_1 = tslib_1.__importDefault(require("./Auth"));
const Database_2 = tslib_1.__importDefault(require("./Database"));
const Server_1 = tslib_1.__importDefault(require("./Server"));
const Storage_2 = tslib_1.__importDefault(require("./Storage"));
exports.Config = {
    app: {
        appKey: '1234',
        providers: [
            Core_1.CacheServiceProvider,
            Core_1.EncryptionServiceProvider,
            Database_1.DatabaseServiceProvider,
            Storage_1.StorageServiceProvider,
            Routing_1.RouteServiceProvider,
            Authentication_1.AuthenticationServiceProvider,
            Core_1.ServerServiceProvider
        ]
    },
    auth: Auth_1.default,
    database: Database_2.default,
    storage: Storage_2.default,
    server: Server_1.default
};
//# sourceMappingURL=index.js.map