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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const app_1 = require("@envuso/app");
const class_transformer_1 = require("class-transformer");
const mongodb_1 = require("mongodb");
const pluralize_1 = __importDefault(require("pluralize"));
const Serializer_1 = require("../Serialization/Serializer");
const QueryBuilder_1 = require("./QueryBuilder");
class Model {
    constructor() {
        /**
         * We'll store the result of the recent mongo request if there
         * is one. This way we always have access to it, and can return
         * generic true/false types of responses for some operations.
         */
        this._recentMongoResponse = null;
        this._queryBuilder = new QueryBuilder_1.QueryBuilder(this);
    }
    /**
     * Access the underlying mongo collection for this model
     */
    collection() {
        return app_1.resolve(this.constructor.name + 'Model');
    }
    /**
     * Get the query builder instance
     */
    queryBuilder() {
        return this._queryBuilder;
    }
    /**
     * A helper method used to return a correct type...
     * We're still getting used to generics.
     *
     * @private
     */
    modelInstance() {
        return this;
    }
    /**
     * Get an instance of the mongo repository
     */
    static getCollection() {
        return app_1.resolve(this.name + 'Model');
    }
    /**
     * Insert a new model into the collection
     *
     * @param entity
     */
    static insert(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = entity.collection();
            const plain = Serializer_1.dehydrateModel(entity);
            const res = yield c.insertOne(plain);
            entity._id = res.insertedId;
            plain._id = res.insertedId;
            return Serializer_1.hydrateModel(plain, entity.constructor);
        });
    }
    /**
     * Update this model
     *
     * @param attributes
     * @param options
     */
    update(attributes, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const plain = Serializer_1.dehydrateModel(Object.assign(Object.assign({}, this), attributes));
            yield this.collection().replaceOne({
                _id: this._id
            }, plain, options);
            for (let attributesKey in attributes) {
                this[attributesKey] = attributes[attributesKey];
            }
            //		await this.refresh();
        });
    }
    /**
     * Query for a single model instance
     *
     * @param query
     */
    static findOne(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.getCollection().findOne(query);
            return Serializer_1.hydrateModel(model, this);
        });
    }
    /**
     * Save any changes made to the model
     *
     * For ex:
     * const user = await User.find(123);
     * user.name = 'Sam';
     * await user.save()
     *
     * @return this
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._id)
                yield Model.insert(this);
            else
                yield this.update(Object.assign({}, this));
            return this;
        });
    }
    /**
     * Get all the properties from the database for this model
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const newVersion = yield this.queryBuilder()
                .where({ _id: this._id })
                .first();
            //		Object.keys(newVersion).forEach(key => this[key] = newVersion[key]);
            Object.assign(this, newVersion);
        });
    }
    /**
     * Delete the current model instance from the collection
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection().deleteOne({ _id: this._id });
        });
    }
    /**
     * calls mongodb.find function and returns its cursor with attached map function that hydrates results
     * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    static get(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield this.getCollection().find(query, options);
            const results = yield cursor.toArray();
            return results.map(doc => Serializer_1.hydrateModel(doc, this));
        });
    }
    /**
     * Count all the documents in the collection
     */
    static count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.where({}).count();
        });
    }
    /**
     * Get an instance of query builder, similar to using collection.find()
     * But... our query builder returns a couple of helper methods, first(), get()
     * {@see QueryBuilder}
     *
     * @param attributes
     */
    static where(attributes) {
        const model = new this();
        return model.queryBuilder().where(attributes);
    }
    /**
     * Allows us to efficiently load relationships
     * Many to many or one to many
     *
     * @param refs
     */
    static with(...refs) {
        const model = new this();
        return model.queryBuilder().with(...refs);
    }
    /**
     * Find an item using it's id and return it as a model.
     *
     * @param id
     */
    static find(id) {
        return this.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    /**
     * Basically an alias of the {@see QueryBuilder.orderByDesc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByDesc(key) {
        return new QueryBuilder_1.QueryBuilder(new this()).orderByDesc(key);
    }
    /**
     * Basically an alias of the {@see QueryBuilder.orderByAsc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByAsc(key) {
        return new QueryBuilder_1.QueryBuilder(new this()).orderByAsc(key);
    }
    /**
     * Create a new instance of this model and store it in the collection
     *
     * @TODO: Need to figure a solution for using generics with static methods.
     *
     * @param {Partial<M>} attributes
     */
    static create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new Model();
            Object.assign(model, attributes);
            yield this.insert(model);
            return yield this.find(model['_id']);
        });
    }
    /**
     * Get an instance of the underlying mongo repository for this model
     */
    static query() {
        //@ts-ignore
        return Container.get(this);
    }
    mongoResponse() {
        return this._recentMongoResponse;
    }
    setMongoResponse(response) {
        this._recentMongoResponse = response;
    }
    /**
     * Will return a correctly formatted name for the underlying mongo collection
     */
    collectionName(many = false) {
        return Model.formatNameForCollection(this.constructor.name, many);
    }
    static formatNameForCollection(str, many = false) {
        return String(pluralize_1.default(str, many ? 2 : 1)).toLowerCase();
    }
    /**
     * When this model instance is returned in a
     * response, we'll make sure to use classToPlain so
     * that any @Exclude() properties etc are taken care of.
     */
    toJSON() {
        return class_transformer_1.classToPlain(this.modelInstance() /*, Config.http.responseSerialization*/);
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map