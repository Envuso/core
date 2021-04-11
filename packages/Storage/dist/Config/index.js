"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const StorageServiceProvider_1 = require("../src/StorageServiceProvider");
const Storage_1 = __importDefault(require("./Storage"));
exports.Config = {
    app: {
        providers: [
            StorageServiceProvider_1.StorageServiceProvider
        ]
    },
    storage: Storage_1.default
};
//# sourceMappingURL=index.js.map