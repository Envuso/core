"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const class_transformer_1 = require("class-transformer");
const mongodb_1 = require("mongodb");
const pluralize_1 = __importDefault(require("pluralize"));
const AppContainer_1 = require("../../AppContainer");
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
        return AppContainer_1.resolve(this.constructor.name + 'Model');
    }
    /**
     * Get an instance of the mongo repository
     */
    static getCollection() {
        return AppContainer_1.resolve(this.name + 'Model');
    }
    /**
     * Get the query builder instance
     */
    queryBuilder() {
        return this._queryBuilder;
    }
    /**
     * Get an instance of query builder, similar to using collection.find()
     * But... our query builder returns a couple of helper methods, first(), get()
     *
     * This method proxies right through to the query builder.
     *
     * {@see QueryBuilder}
     *
     * @param attributes
     */
    static where(attributes) {
        return new this().queryBuilder().where(attributes);
    }
    /**
     * Query for a single model instance
     *
     * @param query
     */
    static findOne(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield new this().collection().findOne(query);
            return Serializer_1.hydrateModel(model, this);
        });
    }
    /**
     * calls mongodb.find function and returns its cursor with attached map function that hydrates results
     * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    static get(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield new this().collection().find(query, options);
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
     * Paginate all data on the collection
     */
    static paginate(limit = 20) {
        return new this().queryBuilder().paginate(limit);
    }
    /**
     * Allows us to efficiently load relationships
     * one to many
     *
     * @param refs
     */
    static with(...refs) {
        return new this().queryBuilder().with(...refs);
    }
    /**
     * Find an item using it's id and return it as a model.
     *
     * @param key
     * @param field
     */
    static find(key, field = '_id') {
        return new this().queryBuilder()
            .where({
            [field]: field === '_id' ? new mongodb_1.ObjectId(key) : key
        })
            .first();
        //		return this.findOne({
        //			[field] : field === '_id' ? new ObjectId(key) : key
        //		});
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
     * Sometimes we just want a simple way to check if
     * a document exists with the specified fields
     *
     * @param {FilterQuery<T>} query
     * @returns {Promise<boolean>}
     */
    static exists(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new this().collection().findOne(query);
            return !!result;
        });
    }
    /**
     * Create a new instance of this model and store it in the collection
     *
     * @param {Partial<M>} attributes
     */
    static create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = new this().collection();
            const createdEntIty = yield collection.insertOne(attributes);
            const newEntity = yield collection.findOne({
                _id: createdEntIty.insertedId
            });
            return Serializer_1.hydrateModel(newEntity, this);
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
            //		const plain = dehydrateModel({...this, ...attributes});
            const attributeChecks = attributes;
            // Update queries in mongo require atomic operators...
            // We'll check if any of the mongo atomic operators are defined
            // in the update query... if so, then we'll manually call $set
            // This will allow us to use both kinds of updates
            let usesAtomicOperator = false;
            for (let key of Object.keys(attributeChecks)) {
                if (this.getMongoAtomicOperators().includes(key)) {
                    usesAtomicOperator = true;
                    break;
                }
            }
            if (!usesAtomicOperator) {
                //@ts-ignore - some silly type issue i cba to figure out rn
                attributes = { $set: attributes };
            }
            yield this.collection().updateOne({
                '_id': this._id
            }, attributes, options);
            const updatedModel = yield this.queryBuilder()
                .where({ _id: this.getModelId() })
                .first();
            Object.assign(this, updatedModel);
            return updatedModel;
            // await this.collection().replaceOne({
            // 	_id : (this as any)._id
            // }, plain as any, options);
            // for (let attributesKey in attributes) {
            // 	(this as any)[attributesKey] = attributes[attributesKey];
            // }
            // await this.refresh();
            //		return this;
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
            //If the model hasn't been persisted to the db yet... we'll
            //dehydrate it, insert it to the db, then add the id to the model
            if (this.isFresh()) {
                const plain = Serializer_1.dehydrateModel(this);
                const res = yield this.collection().insertOne(plain);
                this._id = res.insertedId;
                plain._id = res.insertedId;
                return;
            }
            yield this.update(this);
            return this;
        });
    }
    /**
     * Has this model been persisted to the database yet?
     * @returns {boolean}
     */
    isFresh() {
        return !!this.getModelId();
    }
    /**
     * Get the current models id
     *
     * @returns {ObjectId}
     */
    getModelId() {
        var _a;
        return (_a = this) === null || _a === void 0 ? void 0 : _a._id;
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
            return this;
        });
    }
    /**
     * Delete the current model instance from the collection
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.collection().deleteOne({ _id: this._id });
            return !!response.result.ok;
        });
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
        const options = AppContainer_1.config('server.responseSerialization');
        return class_transformer_1.classToPlainFromExist(this, {}, options);
    }
    getMongoAtomicOperators() {
        return [
            "$currentDate",
            "$inc",
            "$min",
            "$max",
            "$mul",
            "$rename",
            "$set",
            "$setOnInsert",
            "$unset",
            "$addToSet",
            "$pop",
            "$pull",
            "$push",
            "$pullAll",
            "$bit",
        ];
    }
}
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Object)
], Model.prototype, "_recentMongoResponse", void 0);
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", QueryBuilder_1.QueryBuilder)
], Model.prototype, "_queryBuilder", void 0);
exports.Model = Model;
//# sourceMappingURL=Model.js.map