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
import {resolve} from "../../AppContainer";
import {Classes, Exception, Log} from "../../Common";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {CollectionOrder, QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {Database, Model, ModelDecoratorMeta, ModelRelationMeta, ModelRelationType} from "../index";
import {ModelAttributesFilter, ModelAttributesUpdateFilter, ModelProps, SingleModelProp} from "../QueryBuilderTypes";
import {ModelHelpers} from "./ModelHelpers";
import {PaginatedResponse, Paginator} from "./Paginator";
import {QueryAggregation} from "./QueryAggregation";
import {QueryBuilderHelpers} from "./QueryBuilderHelpers";
import {QueryBuilderParts} from "./QueryBuilderParts";
import _ from 'lodash';

export type QueryOperator = "==" | "=" | "!==" | "!=" | ">" | ">=" | "<>" | "<" | "<="

export type QueryResolveType = 'first' | 'get';

export class QueryBuilder<T> implements QueryBuilderContract<T> {

	public _collection: Collection<T>;

	/**
	 * When we call any internal mongo methods to query a collection
	 * we'll store it's instance here so that we can use chaining.
	 *
	 * @template T
	 * @private
	 */
	public _builderResult: FindCursor<T> | AggregationCursor<T>;

	/**
	 * An instance of the model to use for interaction
	 *
	 * @template T
	 * @type {ModelContract<T>}
	 * @private
	 */
	public _model: ModelContract<T>;

	/**
	 * Allow for specifying ordering on the collection
	 *
	 * @type {CollectionOrder | null}
	 * @private
	 */
	public _collectionOrder: CollectionOrder | null = null;

	/**
	 * Limit the return size of the collection
	 *
	 * @type {number}
	 * @private
	 */
	public _limit: number = null;

	/**
	 * Uses the query projection
	 *
	 * @see https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
	 *
	 * @type {object}
	 */
	public _projection: object = {};

	/**
	 * Handle filtering the collection
	 *
	 * @type {object}
	 * @private
	 */
	public _filter: QueryBuilderParts<T> = null;

	/**
	 * Handle collection aggregations
	 * Currently used for collection relations
	 *
	 * @type {object[]}
	 * @private
	 */
	public _aggregation: QueryAggregation<T> = null;

	public readonly _hasOneRelations: ModelRelationMeta[]        = [];
	public readonly _hasManyRelations: ModelRelationMeta[]       = [];
	public readonly _belongsToRelations: ModelRelationMeta[]     = [];
	public readonly _belongsToManyRelations: ModelRelationMeta[] = [];

	constructor(model: ModelContract<T>, collection: Collection<T>) {
		this._model      = model;
		this._collection = collection;

		this._filter      = new QueryBuilderParts<T>((model as any));
		this._aggregation = new QueryAggregation<T>((model as any));

		this._hasOneRelations        = this.getMeta(ModelDecoratorMeta.HAS_ONE_RELATION);
		this._hasManyRelations       = this.getMeta(ModelDecoratorMeta.HAS_MANY_RELATION);
		this._belongsToRelations     = this.getMeta(ModelDecoratorMeta.BELONGS_TO_RELATION);
		this._belongsToManyRelations = this.getMeta(ModelDecoratorMeta.BELONGS_TO_MANY_RELATION);

		this._filter.setRelationsData(this.relations());
	}

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
	public textSearch(searchString: string, language?: string, caseSensitive?: boolean, diacriticSensitive?: boolean): QueryBuilderContract<T> {
		const query: ModelAttributesFilter<T> = {$text : {$search : searchString}};

		if (language !== undefined) {
			query.$text.$language = language;
		}
		if (caseSensitive !== undefined) {
			query.$text.$caseSensitive = caseSensitive;
		}
		if (diacriticSensitive !== undefined) {
			query.$text.$diacriticSensitive = diacriticSensitive;
		}

		this._filter.add(query);

		return this;
	}

	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({key : value}}
	 *
	 * @param key
	 * @param value
	 */
	public where(key: SingleModelProp<T>, value: any): QueryBuilderContract<T>;
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
	public where(key: SingleModelProp<T>, operator: QueryOperator, value: any): QueryBuilderContract<T>;
	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({object})
	 *
	 * @param attributes
	 */
	public where(attributes: ModelAttributesFilter<T>): QueryBuilderContract<T>;
	/**
	 * Similar to using collection.find()
	 * Handles all of the above overloads
	 *
	 * @param attributes
	 * @param operator
	 * @param value
	 */
	public where(attributes: (ModelAttributesFilter<T>) | SingleModelProp<T>, operator?: QueryOperator, value?: any): QueryBuilderContract<T> {
		const totalArgs = arguments.length;

		// If there's only one arg, we're passing a mongo query object
		// Ex: {name: 'bruce'}
		if (totalArgs === 1) {
			this._filter.add(attributes);

			return this;
		}

		// If there's only two args, we're passing key/value
		// Ex: where('name', 'bruce');
		if (totalArgs === 2) {
			const queryKey: string = String(attributes);
			const queryValue: any  = String(operator);

			this._filter.add(queryKey, queryValue);

			return this;
		}

		// If there's three args, we're passing key, operator and value
		// Ex: where('quantity', '>', 3);
		if (totalArgs === 3) {

			const queryKey: string      = String(attributes);
			const queryOperator: string = QueryBuilderHelpers.parseQueryOperator(operator);

			this._filter.add(queryKey, {[queryOperator] : value});

			return this;
		}

		return this;
	}

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
	public whereIn<F extends (keyof T)>(key: F, values: T[F][]): QueryBuilderContract<T> {
		this._filter.add(key, {$in : values});

		return this;
	}

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
	public whereAllIn<F extends (keyof T)>(key: F, values: string[]): QueryBuilderContract<T> {
		this._filter.add(key, {$all : values});

		return this;
	}

	/**
	 * Only run the specified query when the condition returns true
	 *
	 * @template T
	 * @template M
	 * @param {boolean | (() => boolean)} condition
	 * @param {ModelAttributesFilter<T} attributes
	 * @returns {QueryBuilderContract<T>}
	 */
	public when(condition: boolean | (() => boolean), attributes: ModelAttributesFilter<T>): QueryBuilderContract<T> {
		if (typeof condition === 'boolean' && !condition) {
			return this;
		}

		if (typeof condition === 'function' && !condition()) {
			return this;
		}

		return this.where(attributes);
	}


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
	public whereHas<R extends keyof ModelProps<T>>(
		relation: R,
		cb: (builder: QueryBuilderContract<T[R]>) => QueryBuilderContract<T[R]>
	): QueryBuilderContract<T> {
		const relationInfo = this.relations()[relation as string];
		if (!relationInfo) {
			throw new Exception('Cannot find model relation for whereHas');
		}

		const model = Database.getModelFromContainer<T[R]>(relationInfo.relatedModel);

		if (!model) {
			throw new Exception('Cannot find model for whereHas');
		}

		const builder = cb(QueryBuilder.fromContainer<T[R]>(model.prototype));

		this.with(relation);


		this._aggregation.match(builder._filter.reKeyQueryForRelation(relation as string));

		return this;
	}

	public withCount<R extends keyof ModelProps<T>>(relation: R) {
		const relationInfo = this.relations()[relation as string];
		if (!relationInfo) {
			throw new Exception('Cannot find model relation for whereHas');
		}
		const model = Database.getModelFromContainer<T[R]>(relationInfo.relatedModel);
		if (!model) {
			throw new Exception('Cannot find model for whereHas');
		}

		this.with(relation);

		this._aggregation.addFields(`${relationInfo.propertyKey}Count`, {$size : '$' + relationInfo.propertyKey});

		return this;
	}

	/**
	 * @param {R} relation
	 * @returns {QueryBuilderContract<T>}
	 */
	public has<R extends keyof ModelProps<T>>(relation: R,): QueryBuilderContract<T> {
		const relationInfo = this.relations()[relation as string];
		if (!relationInfo) {
			throw new Exception('Cannot find model relation for whereHas');
		}

		this.with(relation);
		this.withCount(relation);

		this._aggregation.match({relation : {$gt : 0}});

		return this;
	}

	/**
	 * Allows us to specify any model relations to load on this query
	 *
	 * @template T
	 * @param relations
	 */
	public with(...relations: (keyof ModelProps<T>)[]): QueryBuilderContract<T> {
		const relationsMeta = this.relations();

		for (let relation of relations) {

			const meta = relationsMeta[relation as string];

			if (!this.isRelation(relation as string) || !meta) {
				Log.warn(`You're trying to load a relation that is not defined as one. `);
				Log.warn(`Attempted relation key is: ${relation}. `);
				Log.warn(`Defined relations are: ${this.joinedRelationsArray().map(r => `${r.propertyKey}(${r.type})`).join(', ')}`);
				continue;
			}

			if (meta.type === ModelRelationType.HAS_ONE) {
				/**
				 * The only way i could figure out aggregation for one to one
				 *
				 * We load the related collection items by local key to foreign key
				 * this will technically give us multiple sub docs on that key...
				 *
				 * However, by using $addFields $first to the query, it'll
				 * pick the first document from that array and set it there.
				 */
				this._aggregation
					.lookup(
						Database.getModelCollectionName(meta.relatedModel),
						meta.localKey,
						meta.foreignKey,
						meta.propertyKey
					)
					.addArrayValueFirstField(
						meta.propertyKey, meta.propertyKey
					);
			}

			/**
			 * This is basically the same as above... except we swap the values around...
			 */
			if (meta.type === ModelRelationType.BELONGS_TO) {
				this._aggregation
					.lookup(
						Database.getModelCollectionName(meta.relatedModel),
						meta.foreignKey,
						meta.localKey,
						meta.propertyKey
					)
					.addArrayValueFirstField(meta.propertyKey, meta.propertyKey);
			}

			if (meta.type === ModelRelationType.HAS_MANY) {
				/**
				 * Basically the same as a MySQL join
				 */
				this._aggregation.lookup(
					Database.getModelCollectionName(meta.relatedModel),
					meta.localKey,
					meta.foreignKey,
					meta.propertyKey
				);
			}

			if (meta.type === ModelRelationType.BELONGS_TO_MANY) {
				this._aggregation.lookup(
					Database.getModelCollectionName(meta.relatedModel),
					meta.foreignKey,
					meta.localKey,
					meta.propertyKey
				);
			}

		}

		return this;
	}

	/**
	 * Add a clause to ensure a key exists or doesnt exist on a document
	 *
	 * @template T
	 * @param {SingleModelProp<T>} key
	 * @param {boolean} existState
	 * @returns {QueryBuilderContract<T>}
	 */
	public exists(key: SingleModelProp<T>, existState: boolean = true): QueryBuilderContract<T> {
		this._filter.add(key, {$exists : existState});

		return this;
	}

	/**
	 * Uses {@see exists}
	 *
	 * @template T
	 * @param {SingleModelProp<T>} key
	 * @returns {QueryBuilderContract<T>}
	 */
	public doesntExist(key: SingleModelProp<T>): QueryBuilderContract<T> {
		return this.exists(key, false);
	}

	/**
	 * Limit the results of the collection
	 *
	 * @param {number} limit
	 * @returns {this<T>}
	 */
	public limit(limit: number) {
		this._limit = limit;

		return this;
	}

	/**
	 * Allows us to specify an order of descending, which is applied to the cursor
	 *
	 * @template T
	 * @param key
	 */
	public orderByDesc(key: keyof T | string): this {
		this._collectionOrder = {
			key       : String(key),
			direction : -1
		};

		return this;
	}

	/**
	 * Allows us to specify an order of ascending, which is applied to the cursor
	 *
	 * @template T
	 * @param key
	 */
	public orderByAsc(key: keyof T | string): this {
		this._collectionOrder = {
			key       : String(key),
			direction : 1
		};

		return this;
	}

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
	public selectFields(...fields: string[]): QueryBuilderContract<T> {
		this.setFieldProjection(fields, true);

		return this;
	}

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
	public excludeFields(...fields: string[]): QueryBuilderContract<T> {
		this.setFieldProjection(fields, false);

		return this;
	}

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
	public setFieldProjection(fields: string[], projection: boolean): QueryBuilderContract<T> {
		for (let field of fields) {
			if (this._projection[field]) {
				Log.label('QUERY BUILDER').warn(`You are marking a field as ${projection ? 'included' : 'excluded'}: "${field}" but it's already part of the mongo query projection`);
				Log.label('QUERY BUILDER').warn(`The current projection for "${field}" is: {"${field}": ${this._projection[field]}}`);
				Log.label('QUERY BUILDER').warn(`You should really try to only include it in "selectFields()" or "excludeFields()" not both.`);
			}

			this._projection[field] = projection ? 1 : 0;
		}

		return this;
	}

	public parseAttributesForUpdateQuery(definedAttributes: ModelAttributesUpdateFilter<T>): UpdateFilter<T> {
		definedAttributes = this._filter.convertSingleQuery(definedAttributes);

		if (!QueryBuilderHelpers.isUpdateQueryUsingAtomicOperators(definedAttributes)) {
			// @TODO: Figure a solution to the below issue

			// We want to iterate over the attributes to actually ensure they're a property
			// of our model. Without this, random properties can be saved onto our document.

			// Note:
			// the above is correct, we do need to do this.
			// But the below is wrong... if we have a property defined on
			// the model, but it doesnt have any value
			// it's undefined, and now we're trying to update it with a value
			// But because it's undefined, it won't be set


			// const attributesToSet = {};
			// for (let attributesKey in attributes) {
			// if (this[attributesKey] === undefined) {
			// 	continue;
			// }
			// attributesToSet[attributesKey] = attributes[attributesKey];
			// }

			//@ts-ignore - some silly type issue i cba to figure out rn
			// attributes = {$set : attributesToSet};

			return {$set : definedAttributes};
		}

		return definedAttributes;
	}

	public async create(attributes: Partial<T>): Promise<T> {
		attributes = this._filter.removeRelationships<any>(attributes);

		const result = await this._collection.insertOne(attributes as any);

		const modelAttributes = await this._collection.findOne({
			_id : result.insertedId
		});

		return this._model.hydrate(modelAttributes);
	}

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
	public async update(attributes: ModelAttributesUpdateFilter<T>, options?: UpdateOptions & { returnMongoResponse: boolean }): Promise<boolean | UpdateResult> {

		const response = await this._collection.updateMany(
			this._filter.getQueryAsFilter(),
			this.parseAttributesForUpdateQuery(attributes),
			options
		);

		if (options?.returnMongoResponse) {
			return response as UpdateResult;
		}

		return !!response?.acknowledged;
	}

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
	public async batchUpdate<P extends SingleModelProp<T>>(uniqueKey: P, updateAttributes: (ModelAttributesUpdateFilter<T>)[]): Promise<BulkWriteResult | null> {
		const bulkWriteOps = [];

		const key: string = String(uniqueKey);

		for (let attributes of updateAttributes) {
			if (!attributes[key]) {
				Log.warn('batchUpdate call is being skipped. There is a missing uniqueKey.', updateAttributes);
				return null;
			}

			const filter = {[key] : attributes[key]};
			delete attributes[key];
			const update = this.parseAttributesForUpdateQuery(attributes);

			bulkWriteOps.push({updateOne : {filter, update}});
		}

		return (await this._collection.bulkWrite(bulkWriteOps));
	}

	/**
	 * Delete any items from the collection specified in the where() clause
	 *
	 * @returns {Promise<boolean>}
	 */
	public async delete(returnMongoResponse: boolean = false): Promise<boolean | DeleteResult> {
		const deleteOperation = await this._collection.deleteMany(this._filter.getQuery());

		if (returnMongoResponse) {
			return deleteOperation;
		}

		return !!deleteOperation.acknowledged;
	}

	/**
	 * Returns the count of items, filters if one was specified with .where()
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
	 * @returns integer
	 */
	public count(): Promise<number> {
		return this._collection.countDocuments(this._filter.getQueryAsFilter());
	}

	/**
	 * Get x random number of documents
	 *
	 * @param {number} amount
	 * @returns {QueryBuilderContract<T>}
	 */
	public random(amount: number = 1): QueryBuilderContract<T> {
		this._aggregation.sample(amount);

		return this;
	}

	/**
	 * Paginate the results
	 *
	 * @param {number} limit
	 * @returns {PaginatorContract<{}>}
	 */
	public async paginate(limit: number = 20): Promise<PaginatedResponse<T>> {
		this.limit(limit);

		const paginator = new Paginator(
			this._model,
			this._filter,
			this._limit
		);

		await paginator.getResults(this);

		return paginator._response;
	}

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
	public async insertMany(models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }> {
		const formattedModels = models.map(model => {
			if (!(model instanceof this._model.constructor)) {
				model = this._model.hydrate(model);
			}

			return model.dehydrate();
		});

		const result = await this._collection.insertMany(formattedModels);

		const wasSuccessful = result.acknowledged && (result.insertedCount === formattedModels.length);

		return {
			success : wasSuccessful,
			ids     : Object.values(result.insertedIds),
		};
	}

	/**
	 * Get the first result in the mongo Cursor
	 *
	 * @template T
	 * @returns {Promise<T>}
	 */
	public async first(options: FindOptions<T> = {}): Promise<T> {
		await this.resolveCursor(options, 'first');

		let result = await this._builderResult.limit(1).next();

		if (!this._builderResult.closed) {
			await this._builderResult.close();
		}

		if (!result) {
			this.cleanupBuilder();

			return null;
		}

		// result = hydrateModel(result, this._model.constructor as any);
		result = this._model.hydrate(result);

		this.cleanupBuilder();

		return result;
	}

	/**
	 * Get all items from the collection that match the query
	 *
	 * @template T
	 * @returns {Promise<T[]>}
	 */
	public async get(options: FindOptions<T> = {}): Promise<T[]> {
		const cursor = await this.resolveCursor(options, 'get');

		const results = (await cursor.toArray()).map(
			// result => hydrateModel(result, this._model.constructor as unknown as ClassType<T>)
			result => this._model.hydrate(result)
		);

		if (!this._builderResult.closed) {
			await this._builderResult.close();
		}

		this.cleanupBuilder();

		return results;
	}

	/**
	 * Get an instance of the underlying mongo cursor
	 *
	 * @template T
	 * @returns {Promise<Cursor<T>>}
	 */
	public cursor(): FindCursor<T> | AggregationCursor<T> {
		return this._builderResult;
	}

	/**
	 * When a filter has been specified with where(). It will apply to
	 * then when we make other calls, like .get(), .first() or
	 * .count() it will resolve the cursor or use it
	 * to make further mongodb calls.
	 *
	 * @private
	 */
	public resolveCursor(options: FindOptions<T> = {}, queryResolveType: QueryResolveType): FindCursor<T> | AggregationCursor<T> {
		/**
		 * if queryResolveType === 'first', we're doing a single item resolve.
		 * We should ignore/remove any "limit" options
		 * This would prevent the user from loading more than necessary, just to
		 * do some more query shit when we handle the ending cursor
		 */
		if (queryResolveType === 'first') {
			if (options.limit) {
				delete options.limit;
			}
			this._limit = null;
		}

		/**
		 * We'll only apply the order if we used {@see orderByAsc()} or {@see orderByDesc()} to apply one
		 */
		if (this._collectionOrder && this._collectionOrder?.direction && !options?.sort) {
			options.sort                            = {};
			options.sort[this._collectionOrder.key] = this._collectionOrder.direction;
		}

		/**
		 * We'll only apply limit if we used the {@see limit()} method to apply one
		 */
		if (this._limit && !options?.limit) {
			options.limit = this._limit;
		}

		if (this._aggregation.hasAggregations()) {

			this._aggregation.setFilterQuery(this._filter, (options.limit ?? null));

			this._builderResult = this._collection.aggregate<T>(
				this._aggregation.getQuery()
			);

			return this._builderResult;
		}

		this._builderResult = this._collection.find(this._filter.getQuery(), options);

		if (Object.keys(this._projection).length) {
			this._builderResult = this._builderResult.project(this._projection);
		}

		return this._builderResult;
	}

	/**
	 * Just makes the implementing code more consistent/shorter
	 *
	 * @param {ModelDecoratorMeta} decoratorType
	 * @returns {ModelRelationMeta[]}
	 * @private
	 */
	public getMeta(decoratorType: ModelDecoratorMeta): ModelRelationMeta[] {
		//return this._model.getMeta<ModelRelationMeta[]>(decoratorType, []);
		return ModelHelpers.getMeta<ModelRelationMeta[]>(this._model, decoratorType);
	}

	/**
	 * Check if a property on the model is part of a relationship
	 *
	 * @param {string} key
	 * @param {ModelRelationType} type
	 * @returns {boolean}
	 */
	public isRelation(key: string, type?: ModelRelationType): boolean {
		return this.joinedRelationsArray().some(relation => {
			if (type) {
				return relation.propertyKey === key && relation.type === type;
			}

			return relation.propertyKey === key;
		});
	}

	public joinedRelationsArray(): ModelRelationMeta[] {
		return [
			...(this._hasOneRelations || []),
			...(this._hasManyRelations || []),
			...(this._belongsToRelations || []),
			...(this._belongsToManyRelations || []),
		];
	}

	/**
	 * Get an object of all relations on this model as an object
	 * Key is the relation property, value is the meta registered
	 *
	 * @returns {ModelRelationMeta[]}
	 */
	public relations(): { [key: string]: ModelRelationMeta } {
		const relations = {};

		for (let modelRelationMeta of this.joinedRelationsArray()) {
			relations[modelRelationMeta.propertyKey] = modelRelationMeta;
		}

		return relations;
	}

	/**
	 * After we have resolved our query, we need to make sure we clear everything
	 * up, just so that filters don't remain and cause unexpected issues
	 * @private
	 */
	public cleanupBuilder() {
		this._builderResult   = null;
		this._collectionOrder = null;
		this._limit           = null;
		this._projection      = {};
		this._filter.cleanup();
		this._aggregation.cleanup();
	}

	public static fromContainer<T>(model: (new () => T) | T): QueryBuilderContract<T> {
		return resolve<QueryBuilderContract<T>>(`Model:QueryBuilder:${Classes.getConstructorName(model)}`);
	}

}
