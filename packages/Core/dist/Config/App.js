"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("@envuso/authentication");
const database_1 = require("@envuso/database");
const routing_1 = require("@envuso/routing");
const storage_1 = require("@envuso/storage");
const CacheServiceProvider_1 = require("../src/Cache/CacheServiceProvider");
const EncryptionServiceProvider_1 = require("../src/Crypt/EncryptionServiceProvider");
const ServerServiceProvider_1 = require("../src/Server/ServerServiceProvider");
exports.default = {
    appKey: '',
    providers: [
        CacheServiceProvider_1.CacheServiceProvider,
        EncryptionServiceProvider_1.EncryptionServiceProvider,
        database_1.DatabaseServiceProvider,
        storage_1.StorageServiceProvider,
        routing_1.RouteServiceProvider,
        authentication_1.AuthenticationServiceProvider,
        ServerServiceProvider_1.ServerServiceProvider
    ],
};
//# sourceMappingURL=App.js.map