import {Cursor, FilterQuery, UpdateManyOptions, UpdateQuery, UpdateWriteOpResult} from "mongodb";
import {ModelProps, ModelRelationMeta, ModelRelationType, QueryOperator, SingleModelProp} from "../../../Database";
import {ModelContract} from "./ModelContract";
import {PaginatorContract} from "./PaginatorContract";

export interface CollectionOrder {
	direction: 1 | -1,
	key: string,
}

/**
 * @template T
 */
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
	 * In mongo terms, this is doing .find({key : value}}
	 *
	 * @param key
	 * @param value
	 */
	where<M>(key: SingleModelProp<T>, value: any): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({amount : {$gt : 10}}
	 * If you're doing .where('amount', '>', 10);
	 *
	 * @param key
	 * @param operator
	 * @param value
	 */
	where<M>(key: SingleModelProp<T>, operator: QueryOperator, value: any): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({object})
	 *
	 * @param attributes
	 */
	where<M>(attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 * Handles all of the above overloads
	 *
	 * @param attributes
	 */
	where<M>(attributes: (FilterQuery<M | T> | Partial<M | T>) | SingleModelProp<T>, operator?: QueryOperator, value?: any): QueryBuilderContract<T>;

	/**
	 * Imagine we have users like
	 * {username: 'jane'}
	 * {username: 'bill'}
	 * {username: 'bob'}
	 *
	 * If we do whereIn('username', ['jane', 'bil']), this will return
	 *
	 * {username: 'jane'}
	 * {username: 'bill'}
	 *
	 * @param key
	 * @param values
	 */
	whereIn<F extends (keyof T)>(
		key: F, values: T[F][]
	): QueryBuilderContract<T>;

	/**
	 * Imagine if we have some book documents like:
	 * {book: 'book name', tags: ['action', 'rpg']}
	 * {book: 'book name', tags: ['action']}
	 *
	 * If we do whereAllIn('tags', ['action']), this will return
	 * {book: 'book name', tags: ['action', 'rpg']}
	 * {book: 'book name', tags: ['action']}
	 *
	 * If we now do whereAllIn('tags', ['action', 'rpg']), this will return
	 * {book: 'book name', tags: ['action', 'rpg']}
	 *
	 * It will search for a document with an array, containing the specific values
	 *
	 * @param key
	 * @param values
	 */
	whereAllIn<F extends (keyof T)>(key: F, values: string[]): QueryBuilderContract<T>;

	/**
	 * Only run the specified query when the condition returns true
	 *
	 * @template T
	 * @template M
	 * @param {boolean | (() => boolean)} condition
	 * @param {FilterQuery<M | T> | Partial<M | T>} attributes
	 * @returns {QueryBuilderContract<T>}
	 */
	when<M>(
		condition: boolean | (() => boolean),
		attributes: FilterQuery<M | T> | Partial<M | T>
	): QueryBuilderContract<T>;

	/**
	 * Check if a property on the model is part of a relationship
	 *
	 * @param {string} key
	 * @param {ModelRelationType} type
	 * @returns {boolean}
	 */
	isRelation(key: string, type?: ModelRelationType): boolean;

	/**
	 * Get an object of all relations on this model as an object
	 * Key is the relation property, value is the meta registered
	 *
	 * @returns {ModelRelationMeta[]}
	 */
	relations(): { [key: string]: ModelRelationMeta };

	/**
	 * Allows us to specify any model relations to load on this query
	 *
	 * @template T
	 * @param relations
	 */
	with(...relations: (keyof ModelProps<T>)[]): QueryBuilderContract<T>;

	/**
	 * Add a clause to ensure a key exists or doesnt exist on a document
	 *
	 * @template T
	 * @param {SingleModelProp<T>} key
	 * @param {boolean} existState
	 * @returns {QueryBuilderContract<T>}
	 */
	exists(key: SingleModelProp<T>|string, existState?: boolean): QueryBuilderContract<T>;

	/**
	 * Uses {@see exists}
	 *
	 * @template T
	 * @param {SingleModelProp<T>} key
	 * @returns {QueryBuilderContract<T>}
	 */
	doesntExist(key: SingleModelProp<T>|string): QueryBuilderContract<T>;

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
