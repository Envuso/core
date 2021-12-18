import {
	AggregationCursor,
	BulkWriteResult,
	Collection,
	DeleteResult,
	FindCursor,
	FindOptions,
	ObjectId,
	UpdateFilter,
	UpdateOptions,
	UpdateResult
} from "mongodb";
import {ModelDecoratorMeta, ModelRelationMeta, ModelRelationType, QueryOperator, QueryResolveType} from "../../../Database";
import {PaginatedResponse} from "../../../Database/Mongo/Paginator";
import {QueryAggregation} from "../../../Database/Mongo/QueryAggregation";
import {QueryBuilderParts} from "../../../Database/Mongo/QueryBuilderParts";
import {ModelAttributesFilter, ModelAttributesUpdateFilter, ModelProps, SingleModelProp} from "../../../Database/QueryBuilderTypes";
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

	_collection: Collection<T>;
	_builderResult: FindCursor<T> | AggregationCursor<T>;
	_model: ModelContract<T>;
	_collectionOrder: CollectionOrder | null;
	_limit: number;
	_projection: object;
	_filter: QueryBuilderParts<T>;
	_hasOneRelations: ModelRelationMeta[];
	_hasManyRelations: ModelRelationMeta[];
	_belongsToRelations: ModelRelationMeta[];
	_belongsToManyRelations: ModelRelationMeta[];

	_aggregation: QueryAggregation<T>;

	/**
	 * Use mongo db's text search feature
	 *
	 * @template T
	 * @param {string} searchString
	 * @param {string} language
	 * @param {boolean} caseSensitive
	 * @param {boolean} diacriticSensitive
	 * @returns {QueryBuilderContract<T>}
	 */
	textSearch(searchString: string, language?: string, caseSensitive?: boolean, diacriticSensitive?: boolean): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({key : value}}
	 *
	 * @param key
	 * @param value
	 */
	where(key: SingleModelProp<T>, value: any): QueryBuilderContract<T>;

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
	where(key: SingleModelProp<T>, operator: QueryOperator, value: any): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({object})
	 *
	 * @param attributes
	 */
	where(attributes: ModelAttributesFilter<T>): QueryBuilderContract<T>;

	/**
	 * Similar to using collection.find()
	 * Handles all of the above overloads
	 *
	 * @param attributes
	 * @param operator
	 * @param value
	 */
	where(attributes: (ModelAttributesFilter<T>) | SingleModelProp<T>, operator?: QueryOperator, value?: any): QueryBuilderContract<T>;

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
	whereIn<F extends (keyof T)>(key: F, values: T[F][]): QueryBuilderContract<T>;

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
	 * @param {ModelAttributesFilter<T} attributes
	 * @returns {QueryBuilderContract<T>}
	 */
	when(condition: boolean | (() => boolean), attributes: (ModelAttributesFilter<T> | ((builder: QueryBuilderContract<T>) => QueryBuilderContract<T>))): QueryBuilderContract<T>;

	/**
	 * Allows us to define a "where query" to limit the results of a relationship query
	 * If we have a user collection and books collection(User has many books)
	 * User -> Books {userId, title}
	 * We can query for a user that has a book with a specific title
	 * for ex: User.query().whereHas('Books', builder => builder.where('title', 'cool book')).get();
	 *
	 * @param {R} relation
	 * @param {(builder: QueryBuilderContract<T[R]>) => QueryBuilderContract<T[R]>} cb
	 * @returns {QueryBuilderContract<T>}
	 */
	whereHas<R extends keyof ModelProps<T>>(
		relation: R,
		cb: (builder: QueryBuilderContract<T[R]>) => QueryBuilderContract<T[R]>
	): QueryBuilderContract<T>;

	withCount<R extends keyof ModelProps<T>>(relation: R): QueryBuilderContract<T>;

	/**
	 * @param {R} relation
	 * @returns {QueryBuilderContract<T>}
	 */
	has<R extends keyof ModelProps<T>>(relation: R): QueryBuilderContract<T>;

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
	exists(key: SingleModelProp<T>, existState?: boolean): QueryBuilderContract<T>;

	/**
	 * Uses {@see exists}
	 *
	 * @template T
	 * @param {SingleModelProp<T>} key
	 * @returns {QueryBuilderContract<T>}
	 */
	doesntExist(key: SingleModelProp<T>): QueryBuilderContract<T>;

	/**
	 * Limit the results of the collection
	 *
	 * @param {number} limit
	 * @returns {this<T>}
	 */
	limit(limit: number): QueryBuilderContract<T>;

	/**
	 * Allows us to specify an order of descending, which is applied to the cursor
	 *
	 * @template T
	 * @param key
	 */
	orderByDesc(key: keyof T | string): this;

	/**
	 * Allows us to specify an order of ascending, which is applied to the cursor
	 *
	 * @template T
	 * @param key
	 */
	orderByAsc(key: keyof T | string): this;

	/**
	 * Mark the fields which should only be returned in the result
	 *
	 * Note: How _id fields work in these queries can be strange, I don't fully
	 * understand it my self. Be sure to read the mongo docs if you're facing weird issues.
	 *
	 * @see https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
	 *
	 * @template T
	 * @param {string} fields
	 * @returns {QueryBuilderContract<T>}
	 */
	selectFields(...fields: string[]): QueryBuilderContract<T>;

	/**
	 * Mark the fields which should excluded from the result
	 *
	 * Note: How _id fields work in these queries can be strange, I don't fully
	 * understand it my self. Be sure to read the mongo docs if you're facing weird issues.
	 *
	 * @see https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
	 *
	 * @template T
	 * @param {string} fields
	 * @returns {QueryBuilderContract<T>}
	 */
	excludeFields(...fields: string[]): QueryBuilderContract<T>;

	/**
	 * Mark the specified fields in the projection as included or excluded
	 *
	 * Note: How _id fields work in these queries can be strange, I don't fully
	 * understand it my self. Be sure to read the mongo docs if you're facing weird issues.
	 *
	 * @see https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
	 *
	 * @template T
	 * @param {string[]} fields
	 * @param {boolean} projection
	 * @returns {QueryBuilderContract<T>}
	 */
	setFieldProjection(fields: string[], projection: boolean): QueryBuilderContract<T>;

	parseAttributesForUpdateQuery(definedAttributes: ModelAttributesUpdateFilter<T>): UpdateFilter<T>;

	/**
	 * Update many items in the collection, will use the filter specified by .where()
	 * You can specify {returnMongoResponse : true} in the options to return the mongo result
	 * of this operation, otherwise, this method will return true/false if it succeeded or failed.
	 *
	 * @template T
	 * @param attributes
	 * @param options
	 * @return boolean | UpdateWriteOpResult
	 */
	update(attributes: ModelAttributesUpdateFilter<T>, options?: UpdateOptions & { returnMongoResponse: boolean }): Promise<boolean | UpdateResult>;

	create(attributes: Partial<T>): Promise<any>;

	/**
	 * Whatever is provided as the uniqueKey should exist in the attribute object for each item.
	 *
	 * for example, we want to update usernames of users by their _id
	 * If we don't provide one, mongo isn't going to filter your updates correctly.
	 *
	 * .batchUpdate('_id', [
	 *  {_id: '1234', username : 'Barry'},
	 *  {_id: '23872', username : 'Bruce'},
	 * ]);
	 *
	 * @template T
	 * @param {P} uniqueKey
	 * @param {ModelAttributesUpdateFilter<T>[]} updateAttributes
	 * @returns {Promise<BulkWriteResult | null>}
	 */
	batchUpdate<P extends SingleModelProp<T>>(uniqueKey: P, updateAttributes: (ModelAttributesUpdateFilter<T>)[]): Promise<BulkWriteResult | null>;

	/**
	 * Delete any items from the collection specified in the where() clause
	 *
	 * @returns {Promise<boolean>}
	 */
	delete(returnMongoResponse?: boolean): Promise<boolean | DeleteResult>;

	/**
	 * Returns the count of items, filters if one was specified with .where()
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
	 * @returns integer
	 */
	count(): Promise<number>;

	/**
	 * Get x random number of documents
	 *
	 * @param {number} amount
	 * @returns {QueryBuilderContract<T>}
	 */
	random(amount?: number): QueryBuilderContract<T>;

	/**
	 * Paginate the results
	 *
	 * @param {number} limit
	 * @returns {PaginatorContract<{}>}
	 */
	paginate(limit: number): Promise<PaginatedResponse<T>>;

	/**
	 * Insert many created models(documents) into the collection
	 *
	 * We can pass multiple model instances, or raw objects.
	 *
	 * Example:
	 *
	 * const bruce = new User()
	 * bruce.username = 'bruce';
	 * const sally = new User()
	 * sally.username = 'sally';
	 * docs = [bruce, sally]
	 *
	 * is the same as:
	 *
	 * docs = [{username:'bruce'}, {username:'sally'}]
	 *
	 * @template T
	 * @param {T[] | Partial<T>[]} models
	 * @returns {Promise<{success: boolean, ids: ObjectId[]}>}
	 */
	insertMany(models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }>;

	/**
	 * Get the first result in the mongo Cursor
	 *
	 * @template T
	 * @returns {Promise<T>}
	 */
	first(options?: FindOptions<T>): Promise<T>;

	/**
	 * Get all items from the collection that match the query
	 *
	 * @template T
	 * @returns {Promise<T[]>}
	 */
	get(options?: FindOptions<T>): Promise<T[]>;

	/**
	 * Get an instance of the underlying mongo cursor
	 *
	 * @template T
	 * @returns {Promise<Cursor<T>>}
	 */
	cursor(): FindCursor<T> | AggregationCursor<T>;

	/**
	 * When a filter has been specified with where(). It will apply to
	 * {@see _collectionFilter} then when we make other calls, like
	 * .get(), .first() or .count() it will resolve the cursor
	 * or use it to make further mongodb calls.
	 *
	 * @private
	 */
	resolveCursor(options: FindOptions<T>, queryResolveType: QueryResolveType): FindCursor<T> | AggregationCursor<T>;

	/**
	 * Just makes the implementing code more consistent/shorter
	 *
	 * @param {ModelDecoratorMeta} decoratorType
	 * @returns {ModelRelationMeta[]}
	 * @private
	 */
	getMeta(decoratorType: ModelDecoratorMeta): ModelRelationMeta[];

	/**
	 * Check if a property on the model is part of a relationship
	 *
	 * @param {string} key
	 * @param {ModelRelationType} type
	 * @returns {boolean}
	 */
	isRelation(key: string, type?: ModelRelationType): boolean;

	joinedRelationsArray(): ModelRelationMeta[];

	/**
	 * Get an object of all relations on this model as an object
	 * Key is the relation property, value is the meta registered
	 *
	 * @returns {ModelRelationMeta[]}
	 */
	relations(): { [key: string]: ModelRelationMeta };

	/**
	 * Chain pipeline queries onto the query
	 *
	 * @param {(builder: QueryAggregation<T>) => QueryAggregation<T>} cb
	 * @returns {QueryBuilderContract<T>}
	 */
	aggregationPipeline(cb: (builder: QueryAggregation<T>) => QueryAggregation<T>): QueryBuilderContract<T>;

	/**
	 * Access the aggregation pipeline query builder
	 *
	 * @returns {QueryAggregation<T>}
	 */
	aggregationPipelineBuilder(): QueryAggregation<T>;

	/**
	 * After we have resolved our query, we need to make sure we clear everything
	 * up, just so that filters don't remain and cause unexpected issues
	 * @private
	 */
	cleanupBuilder(): void;

}
