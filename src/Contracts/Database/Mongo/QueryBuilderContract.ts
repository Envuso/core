import {Cursor, FilterQuery, UpdateManyOptions, UpdateQuery, UpdateWriteOpResult} from "mongodb";
import {ModelContract} from "./ModelContract";
import {PaginatorContract} from "./PaginatorContract";

export interface CollectionOrder {
	direction: 1 | -1,
	key: string,
}

export interface QueryBuilderContract<T> {
	_builderResult: Cursor<T>;
	_model: ModelContract<T>;
	_collectionFilter: object;
	_collectionAggregation: object[];
	_collectionOrder: CollectionOrder | null;
	_limit: number;
	readonly collectionFilter: Object;

	/**
	 * Similar to using collection.find()
	 *
	 * @param attributes
	 */
	where<M>(attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilderContract<T>;

	when<M>(
		condition: boolean | (() => boolean),
		attributes: FilterQuery<M | T> | Partial<M | T>
	): QueryBuilderContract<T>;

	/**
	 * Allows us to specify any model refs to load in this query
	 *
	 * @param refsToLoad
	 */
	with(...refsToLoad: (keyof T)[]): QueryBuilderContract<T>;

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
	update(
		attributes: UpdateQuery<T> | Partial<T>,
		options?: UpdateManyOptions & { returnMongoResponse: boolean }
	): Promise<boolean | UpdateWriteOpResult>;

	/**
	 * Get an instance of the underlying mongo cursor
	 */
	cursor(): Promise<Cursor<T>>;

	/**
	 * Limit the results of the collection
	 *
	 * @param {number} limit
	 * @returns {QueryBuilderContract<T>}
	 */
	limit(limit: number): QueryBuilderContract<T>;

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
	 * @returns {PaginatorContract<T>}
	 */
	paginate(limit: number): Promise<PaginatorContract<T>>;

	/**
	 * When a filter has been specified with where(). It will apply to
	 * {@see _collectionFilter} then when we make other calls, like
	 * .get(), .first() or .count() it will resolve the cursor
	 * or use it to make further mongodb calls.
	 *
	 * @private
	 */
	resolveFilter(): any;

	/**
	 * After we have resolved our query, we need to make sure we clear everything
	 * up, just so that filters don't remain and cause unexpected issues
	 * @private
	 */
	cleanupBuilder(): void;
}
