import { Cursor, FilterQuery, UpdateManyOptions, UpdateQuery, UpdateWriteOpResult } from "mongodb";
import { Model } from "./Model";
import { Paginator } from "./Paginator";
export declare class QueryBuilder<T> {
    /**
     * When we call any internal mongo methods to query a collection
     * we'll store it's instance here so that we can use chaining.
     *
     * @private
     */
    private _builderResult;
    /**
     * An instance of the model to use for interaction
     *
     * @type {Model<T>}
     * @private
     */
    private _model;
    /**
     * Handle filtering the collection
     *
     * @type {object}
     * @private
     */
    private _collectionFilter;
    /**
     * Handle collection aggregations
     * Currently used for collection relations
     *
     * @type {object[]}
     * @private
     */
    private _collectionAggregation;
    /**
     * Allow for specifying ordering on the collection
     *
     * @type {CollectionOrder | null}
     * @private
     */
    private _collectionOrder;
    /**
     * Limit the return size of the collection
     *
     * @type {number}
     * @private
     */
    private _limit;
    constructor(model: Model<T>);
    /**
     * Similar to using collection.find()
     *
     * @param attributes
     */
    where<M>(attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilder<T>;
    when<M>(condition: boolean | (() => boolean), attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilder<T>;
    /**
     * Allows us to specify any model refs to load in this query
     *
     * @param refsToLoad
     */
    with(...refsToLoad: (keyof T)[]): QueryBuilder<T>;
    /**
     * Allows us to specify an order of descending, which is applied to the cursor
     *
     * @param key
     */
    orderByDesc(key: keyof T | string): this;
    /**
     * Allows us to specify an order of ascending, which is applied to the cursor
     *
     * @param key
     */
    orderByAsc(key: keyof T | string): this;
    /**
     * Get the first result in the mongo Cursor
     */
    first(): Promise<T>;
    /**
     * Get all items from the collection that match the query
     */
    get(): Promise<T[]>;
    /**
     * Update many items in the collection, will use the filter specified by .where()
     * You can specify {returnMongoResponse : true} in the options to return the mongo result
     * of this operation, otherwise, this method will return true/false if it succeeded or failed.
     *
     * @param attributes
     * @param options
     * @return boolean | UpdateWriteOpResult
     */
    update(attributes: UpdateQuery<T> | Partial<T>, options?: UpdateManyOptions & {
        returnMongoResponse: boolean;
    }): Promise<boolean | UpdateWriteOpResult>;
    /**
     * Get an instance of the underlying mongo cursor
     */
    cursor(): Promise<Cursor<T>>;
    /**
     * Limit the results of the collection
     *
     * @param {number} limit
     * @returns {this<T>}
     */
    limit(limit: number): this;
    /**
     * Delete any items from the collection specified in the where() clause
     *
     * @returns {Promise<boolean>}
     */
    delete(): Promise<boolean>;
    /**
     * Returns the count of items, filters if one was specified with .where()
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
     * @returns integer
     */
    count(): Promise<number>;
    /**
     * Paginate the results
     *
     * @param {number} limit
     * @returns {Paginator<{}>}
     */
    paginate(limit?: number): Promise<Paginator<T>>;
    /**
     * When a filter has been specified with where(). It will apply to
     * {@see _collectionFilter} then when we make other calls, like
     * .get(), .first() or .count() it will resolve the cursor
     * or use it to make further mongodb calls.
     *
     * @private
     */
    private resolveFilter;
    get collectionFilter(): object;
    /**
     * After we have resolved our query, we need to make sure we clear everything
     * up, just so that filters don't remain and cause unexpected issues
     * @private
     */
    private cleanupBuilder;
}
