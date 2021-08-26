"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Storage_1 = require("../Storage");
const Storage_2 = require("../Storage");
exports.default = {
    /**
     * The default storage provider to use on the request() helper
     * or when using Storage.get(), Storage.put() etc
     */
    defaultDisk: 'local',
    disks: {
        s3: {
            driver: 's3',
            bucket: process.env.SPACES_BUCKET,
            url: process.env.SPACES_URL,
            endpoint: process.env.SPACES_ENDPOINT,
            credentials: {
                accessKeyId: process.env.SPACES_KEY,
                secretAccessKey: process.env.SPACES_SECRET,
            }
        },
        temp: {
            driver: 'local',
            root: path_1.default.join(process.cwd(), 'storage', 'temp'),
        },
        local: {
            driver: 'local',
            root: path_1.default.join(process.cwd(), 'storage', 'local'),
        },
        storage: {
            driver: 'local',
            root: path_1.default.join(process.cwd(), 'storage'),
        },
    },
    drivers: {
        local: Storage_1.LocalFileProvider,
        s3: Storage_2.S3Provider,
    }
};
//# sourceMappingURL=Storage.js.map