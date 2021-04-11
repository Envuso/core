"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    mongo: {
        name: 'test',
        url: 'mongodb://127.0.0.1:27017',
        clientOptions: {
            ssl: false,
            readPreference: "primaryPreferred",
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    redis: {
        name: 'default',
    }
};
//# sourceMappingURL=Database.js.map