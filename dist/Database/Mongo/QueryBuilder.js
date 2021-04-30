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
exports.QueryBuilder = void 0;
const Serializer_1 = require("../Serialization/Serializer");
const Model_1 = require("./Model");
const Paginator_1 = require("./Paginator");
class QueryBuilder {
    constructor(model) {
        /**
         * Handle filtering the collection
         *
         * @type {object}
         * @private
         */
        this._collectionFilter = null;
        /**
         * Handle collection aggregations
         * Currently used for collection relations
         *
         * @type {object[]}
         * @private
         */
        this._collectionAggregation = [];
        /**
         * Allow for specifying ordering on the collection
         *
         * @type {CollectionOrder | null}
         * @private
         */
        this._collectionOrder = null;
        /**
         * Limit the return size of the collection
         *
         * @type {number}
         * @private
         */
        this._limit = null;
        this._model = model;
    }
    /**
     * Similar to using collection.find()
     *
     * @param attributes
     */
    where(attributes) {
        this._collectionFilter = Object.assign(Object.assign({}, this._collectionFilter), attributes);
        return this;
    }
    /**
     * Allows us to specify any model refs to load in this query
     *
     * @param refsToLoad
     */
    with(...refsToLoad) {
        const refs = Reflect.getMetadata('mongo:refs', this._model) || {};
        for (let ref of refsToLoad) {
            const refInfo = refs[ref];
            //			if (!refInfo) {
            //				throw new InvalidRefSpecified(this._model.constructor.name, String(ref));
            //			}
            this._collectionAggregation.push({
                $lookup: {
                    from: Model_1.Model.formatNameForCollection(refInfo.modelName, true),
                    localField: refInfo._id,
                    foreignField: '_id',
                    as: ref
                }
            });
            if (!refInfo.array) {
                this._collectionAggregation.push({
                    $unwind: {
                        path: '$' + Model_1.Model.formatNameForCollection(refInfo.modelName, refInfo.array),
                        preserveNullAndEmptyArrays: true
                    }
                });
            }
        }
        return this;
    }
    /**
     * Allows us to specify an order of descending, which is applied to the cursor
     *
     * @param key
     */
    orderByDesc(key) {
        this._collectionOrder = {
            key: String(key),
            direction: -1
        };
        return this;
    }
    /**
     * Allows us to specify an order of ascending, which is applied to the cursor
     *
     * @param key
     */
    orderByAsc(key) {
        this._collectionOrder = {
            key: String(key),
            direction: 1
        };
        return this;
    }
    /**
     * Get the first result in the mongo Cursor
     */
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolveFilter();
            let result = yield this._builderResult.limit(1).next();
            if (!result) {
                this.cleanupBuilder();
                return null;
            }
            result = Serializer_1.hydrateModel(result, this._model.constructor);
            this.cleanupBuilder();
            return result;
        });
    }
    /**
     * Get all items from the collection that match the query
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield this.resolveFilter();
            const results = (yield cursor.toArray()).map(result => Serializer_1.hydrateModel(result, this._model.constructor));
            this.cleanupBuilder();
            return results;
        });
    }
    /**
     * Update many items in the collection, will use the filter specified by .where()
     * You can specify {returnMongoResponse : true} in the options to return the mongo result
     * of this operation, otherwise, this method will return true/false if it succeeded or failed.
     *
     * @param attributes
     * @param options
     * @return boolean | UpdateWriteOpResult
     */
    update(attributes, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._model.collection().updateMany(this._collectionFilter, attributes, options);
            if (options === null || options === void 0 ? void 0 : options.returnMongoResponse) {
                return response;
            }
            this._model.setMongoResponse(response);
            return !!((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.ok);
        });
    }
    /**
     * Get an instance of the underlying mongo cursor
     */
    cursor() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._builderResult;
        });
    }
    /**
     * Limit the results of the collection
     *
     * @param {number} limit
     * @returns {this<T>}
     */
    limit(limit) {
        this._limit = limit;
        return this;
    }
    /**
     * Delete any items from the collection specified in the where() clause
     *
     * @returns {Promise<boolean>}
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOperation = yield this._model
                .collection()
                .deleteMany(this._collectionFilter);
            return !!deleteOperation.result.ok;
        });
    }
    /**
     * Returns the count of items, filters if one was specified with .where()
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
     * @returns integer
     */
    count() {
        return this._model.collection().countDocuments(this._collectionFilter);
    }
    /**
     * Paginate the results
     *
     * @param {number} limit
     * @returns {Paginator<{}>}
     */
    paginate(limit = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            this.limit(limit);
            const paginator = new Paginator_1.Paginator(this._model, this._collectionFilter, this._limit);
            yield paginator.getResults();
            return paginator;
        });
    }
    /**
     * When a filter has been specified with where(). It will apply to
     * {@see _collectionFilter} then when we make other calls, like
     * .get(), .first() or .count() it will resolve the cursor
     * or use it to make further mongodb calls.
     *
     * @private
     */
    resolveFilter() {
        var _a, _b;
        const options = {};
        if (this._collectionOrder && ((_a = this._collectionOrder) === null || _a === void 0 ? void 0 : _a.direction)) {
            options.sort = {};
            options.sort[this._collectionOrder.key] = this._collectionOrder.direction;
        }
        if (this._limit) {
            options.limit = this._limit;
        }
        if ((_b = this._collectionAggregation) === null || _b === void 0 ? void 0 : _b.length) {
            const aggregation = [
                { $match: this._collectionFilter },
                ...this._collectionAggregation
            ];
            this._builderResult = this._model
                .collection()
                .aggregate(aggregation);
            return this._builderResult;
        }
        this._builderResult = this._model
            .collection()
            .find(this._collectionFilter, options);
        return this._builderResult;
    }
    /**
     * After we have resolved our query, we need to make sure we clear everything
     * up, just so that filters don't remain and cause unexpected issues
     * @private
     */
    cleanupBuilder() {
        this._builderResult = null;
        this._collectionFilter = null;
        this._collectionAggregation = null;
        this._collectionOrder = null;
        this._limit = null;
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map