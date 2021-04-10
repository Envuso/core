"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextStore = void 0;
const common_1 = require("@envuso/common");
const async_hooks_1 = require("async_hooks");
let instance = null;
class RequestContextStore {
    constructor() {
        this._store = new async_hooks_1.AsyncLocalStorage();
        instance = this;
    }
    static getInstance() {
        if (instance) {
            return instance;
        }
        return new RequestContextStore();
    }
    context() {
        return this._store.getStore();
    }
    bind(request, done) {
        this._store.run(Reflect.getMetadata(common_1.METADATA.HTTP_CONTEXT, request), done);
    }
}
exports.RequestContextStore = RequestContextStore;
//# sourceMappingURL=RequestContextStore.js.map