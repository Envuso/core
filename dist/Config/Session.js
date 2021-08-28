"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("../Common");
exports.default = {
    cookie: {
        path: '/',
        httpOnly: false,
        secure: true,
        expires: Common_1.DateTime.now().addYears(5).toDate(),
        sameSite: true,
        domain: null,
    },
    cookieName: 'session',
    encryptCookies: true,
};
//# sourceMappingURL=Session.js.map