import { Cursor, UpdateManyOptions } from "mongodb";
import { Model } from "./Model";
export declare class QueryBuilder<T> {
    /**
     * When we call any internal mongo methods to query a collection
     * we'll store it's instance here so that we can use chaining.
     *
     * @private
     */
    private _builderResult;
    private _model;
    private _collectionFilter;
    private _collectionAggregation;
    private _collectionOrder;
    constructor(model: Model<T>);
    /**
     * Similar to using collection.find()
     *
     * @param attributes
     */
    where<M>(attributes: Partial<M>): QueryBuilder<T>;
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
     * When a filter has been specified with where(). It will apply to
     * {@see _collectionFilter} then when we make other calls, like
     * .get(), .first() or .count() it will resolve the cursor
     * or use it to make further mongodb calls.
     *
     * @private
     */
    private resolveFilter;
    /**
     * Get the first result in the mongo Cursor
     */
    first(): Promise<unknown>;
    /**
     * Get all items from the collection that match the query
     */
    get(): Promise<unknown[]>;
    /**
     * Update many items in the collection, will use the filter specified by .where()
     * You can specify {returnMongoResponse : true} in the options to return the mongo result
     * of this operation, otherwise, this method will return true/false if it succeeded or failed.
     *
     * @param attributes
     * @param options
     * @return boolean | UpdateWriteOpResult
     */
    update(attributes: Partial<T>, options?: UpdateManyOptions & {
        returnMongoResponse: boolean;
    }): Promise<boolean | import("mongodb").UpdateWriteOpResult>;
    /**
     * Get an instance of the underlying mongo cursor
     */
    cursor(): Promise<Cursor<T>>;
    /**
     * Returns the count of items, filters if one was specified with .where()
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
     * @returns integer
     */
    count(): Promise<number>;
}
