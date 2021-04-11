"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S3Provider_1 = require("../src/Providers/S3Provider");
exports.default = {
    /**
     * The default storage provider to use on the request() helper
     * or when using Storage.get(), Storage.put() etc
     */
    defaultProvider: S3Provider_1.S3Provider,
    /**
     * Your S3 config
     * (Should hopefully work for other services like DigitalOcean Spaces also)
     */
    s3: {
        bucket: process.env.SPACES_BUCKET,
        url: process.env.SPACES_URL,
        endpoint: process.env.SPACES_ENDPOINT,
        credentials: {
            accessKeyId: process.env.SPACES_KEY,
            secretAccessKey: process.env.SPACES_SECRET,
        }
    },
};
//# sourceMappingURL=Storage.js.map