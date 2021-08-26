"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateTime_1 = require("../Common/Utility/DateTime");
exports.default = {
    cookie: {
        path: '/',
        httpOnly: false,
        secure: true,
        expires: DateTime_1.DateTime.now().add(5, 'years').toDate(),
        sameSite: true,
        domain: null,
    },
    cookieName: 'session',
    encryptCookies: true,
};
//# sourceMappingURL=Session.js.map