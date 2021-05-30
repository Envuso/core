"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginator = void 0;
const mongodb_1 = require("mongodb");
const Routing_1 = require("../../Routing");
class Paginator {
    constructor(model, query, limit) {
        this.model = model;
        this.query = query;
        this.limit = limit;
        this._response = null;
        this._beforeCursor = null;
        this._afterCursor = null;
    }
    /**
     * Get the results of the paginated request
     *
     * @returns {Promise<Paginator<T>>}
     */
    getResults() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setPageCursors();
            this.mergeQuery(this.setupQuery());
            const results = yield this.model.queryBuilder()
                .where(this.query)
                .limit(this.limit)
                .get();
            this._response = {
                data: results,
                pagination: {
                    before: this._beforeCursor,
                    after: this._afterCursor,
                    hasNext: false,
                    hasPrevious: false,
                    total: 0,
                    limit: this.limit,
                }
            };
            if (!(results === null || results === void 0 ? void 0 : results.length))
                return this;
            const total = yield this.model.queryBuilder().where(this.query).count();
            const hasNext = (results.length === this.limit) && (total > results.length);
            const hasPrevious = this.getAfterCursor() !== null;
            this._response.pagination = {
                before: hasPrevious ? results[0]._id : null,
                after: hasNext ? results[results.length - 1]._id : null,
                hasNext: hasNext,
                hasPrevious: hasPrevious,
                total: total,
                limit: this.limit
            };
            return this;
        });
    }
    /**
     * Attempt to get the before/after cursors specified on the request
     * We'll then store them on the class
     */
    setPageCursors() {
        var _a, _b;
        this._afterCursor = (_a = Routing_1.RequestContext.request().get('after')) !== null && _a !== void 0 ? _a : null;
        this._beforeCursor = (_b = Routing_1.RequestContext.request().get('before')) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Get the before cursor
     *
     * @returns {string | null}
     */
    getBeforeCursor() {
        return this._beforeCursor;
    }
    /**
     * Get the after cursor
     *
     * @returns {string | null}
     */
    getAfterCursor() {
        return this._afterCursor;
    }
    /**
     * Prepare the query and check if we have cursors set on the request
     *
     * @returns {null | {_id: {}}}
     * @private
     */
    setupQuery() {
        let query = {
            '_id': {}
        };
        // Check if we have a before cursor set, if so lets handle that.
        if (this.getBeforeCursor()) {
            query['_id'] = { $lt: new mongodb_1.ObjectId(this.getBeforeCursor()) };
            return query;
        }
        // If we didn't have a before... then what about an after?
        if (this.getAfterCursor()) {
            query['_id'] = { $gt: new mongodb_1.ObjectId(this.getAfterCursor()) };
            return query;
        }
        return {};
    }
    /**
     * Try to ensure that we can assign our pagination filter to the query
     * without overwriting any thing else the developer specifies on the query
     *
     * @param query
     */
    mergeQuery(query) {
        var _a;
        if (this.query === null) {
            this.query = {};
        }
        let currentQueryId = (_a = this.query) === null || _a === void 0 ? void 0 : _a._id;
        if (currentQueryId) {
            query = Object.assign(Object.assign({}, currentQueryId), query._id);
        }
        if (query._id)
            this.query._id = query._id;
        this.query = Object.assign(Object.assign({}, this.query), query);
    }
    /**
     * Get the response of the paginator
     *
     * @returns {PaginatedResponse<T>}
     */
    getResponse() {
        return this._response;
    }
    toJSON() {
        return this._response;
    }
}
exports.Paginator = Paginator;
//# sourceMappingURL=Paginator.js.map