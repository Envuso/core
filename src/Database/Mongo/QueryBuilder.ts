import {Cursor, FilterQuery, FindOneOptions, UpdateManyOptions, UpdateQuery, UpdateWriteOpResult, WithoutProjection} from "mongodb";
import {Log} from "../../Common";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {CollectionOrder, QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {ClassType, ModelDecoratorMeta, ModelProps, ModelRelationMeta, ModelRelationType, Ref, SingleModelProp} from "../index";
import {getModelCollectionName} from "../ModelHelpers";
import {hydrateModel} from "../Serialization/Serializer";
import {Paginator} from "./Paginator";

export type QueryOperator = "==" | "=" | "!==" | "!=" | ">" | ">=" | "<>" | "<" | "<="

export class QueryBuilder<T> implements QueryBuilderContract<T> {

	/**
	 * When we call any internal mongo methods to query a collection
	 * we'll store it's instance here so that we can use chaining.
	 *
	 * @template T
	 * @private
	 */
	public _builderResult: Cursor<T>;

	/**
	 * An instance of the model to use for interaction
	 *
	 * @template T
	 * @type {ModelContract<T>}
	 * @private
	 */
	public _model: ModelContract<T>;

	/**
	 * Handle filtering the collection
	 *
	 * @type {object}
	 * @private
	 */
	public _collectionFilter: object = null;

	/**
	 * Handle collection aggregations
	 * Currently used for collection relations
	 *
	 * @type {object[]}
	 * @private
	 */
	public _collectionAggregation: object[] = [];

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

	private readonly _hasOneRelations: ModelRelationMeta[]  = [];
	private readonly _hasManyRelations: ModelRelationMeta[] = [];

	constructor(model: ModelContract<T>) {
		this._model = model;

		this._hasOneRelations  = this._model.getMeta<ModelRelationMeta[]>(
			ModelDecoratorMeta.HAS_ONE_RELATION, []
		);
		this._hasManyRelations = this._model.getMeta<ModelRelationMeta[]>(
			ModelDecoratorMeta.HAS_MANY_RELATION, []
		);
	}


	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({key : value}}
	 *
	 * @param key
	 * @param value
	 */
	public where<M>(key: SingleModelProp<T>, value: any): QueryBuilderContract<T>;
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
	public where<M>(key: SingleModelProp<T>, operator: QueryOperator, value: any): QueryBuilderContract<T>;
	/**
	 * Similar to using collection.find()
	 *
	 * In mongo terms, this is doing .find({object})
	 *
	 * @param attributes
	 */
	public where<M>(attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilderContract<T>;
	/**
	 * Similar to using collection.find()
	 * Handles all of the above overloads
	 *
	 * @param attributes
	 */
	public where<M>(attributes: (FilterQuery<M | T> | Partial<M | T>) | SingleModelProp<T>, operator?: QueryOperator, value?: any): QueryBuilderContract<T> {
		const totalArgs = arguments.length;

		// If there's only one arg, we're passing a mongo query object
		// Ex: {name: 'bruce'}
		if (totalArgs === 1) {
			this._collectionFilter = {
				...this._collectionFilter,
				...(attributes as (FilterQuery<M | T> | Partial<M | T>))
			};

			return this;
		}

		// If there's only two args, we're passing key/value
		// Ex: where('name', 'bruce');
		if (totalArgs === 2) {
			this._collectionFilter = {
				...this._collectionFilter,
				...({[(attributes as any) as string] : operator})
			};

			return this;
		}

		// If there's three args, we're passing key, operator and value
		// Ex: where('quantity', '>', 3);
		if (totalArgs === 3) {
			this._collectionFilter = {
				...this._collectionFilter,
				...(
					{
						[(attributes as any) as string] : {
							[this.parseQueryOperator(operator)] : value
						}
					}
				)
			};

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
		this._collectionFilter = {
			...this._collectionFilter,
			[key] : {$in : values},
		};

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
		this._collectionFilter = {
			...this._collectionFilter,
			[key] : {$all : values},
		};

		return this;
	}

	/**
	 * Only run the specified query when the condition returns true
	 *
	 * @template T
	 * @template M
	 * @param {boolean | (() => boolean)} condition
	 * @param {FilterQuery<M | T> | Partial<M | T>} attributes
	 * @returns {QueryBuilderContract<T>}
	 */
	public when<M>(
		condition: boolean | (() => boolean),
		attributes: FilterQuery<M | T> | Partial<M | T>
	): QueryBuilderContract<T> {
		if (typeof condition === 'boolean' && !condition) {
			return this;
		}

		if (typeof condition === 'function' && !condition()) {
			return this;
		}

		return this.where<M>(attributes);
	}

	/**
	 * Allows us to specify any model refs to load in this query
	 *
	 * @template T
	 * @param refsToLoad
	 */
	public oldWith(...refsToLoad: (keyof T)[]): QueryBuilderContract<T> {
		const refs = Reflect.getMetadata('mongo:refs', this._model) || {};

		for (let ref of refsToLoad) {

			const refInfo: Ref = refs[ref];

			//			if (!refInfo) {
			//				throw new InvalidRefSpecified(this._model.constructor.name, String(ref));
			//			}

			this._collectionAggregation.push({
				$lookup : {
					from         : refInfo.aggregationLookupModelName,//Model.formatNameForCollection(refInfo.modelName, true),
					localField   : refInfo._id,
					foreignField : '_id',
					as           : ref
				}
			});

			if (!refInfo.array) {
				this._collectionAggregation.push({
					$unwind : {
						path                       : '$' + refInfo.aggregationUnwindModelName,//Model.formatNameForCollection(refInfo.modelName, refInfo.array),
						preserveNullAndEmptyArrays : true
					}
				});
			}


		}

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
				const relationKeys = [...this._hasOneRelations, ...this._hasManyRelations].map(
					r => `${r.propertyKey}(${r.type})`
				).join(', ');
				Log.warn(`Defined relations are: ${relationKeys}`);
				continue;
			}

			if (meta.type === ModelRelationType.HAS_ONE) {
				/**
				 * The only way i could figure out aggregation for one to one
				 *
				 * We load the related collection items by local key to foreign key
				 * in to a "temporary" key on the document
				 *
				 * We then add a new field for the desired relation name with
				 * the first item from the temporary document field
				 *
				 * Then we remove the temporary array. I don't think it's great...
				 * but I'm honestly not sure about the performance impacts.
				 *
				 * Anything is better than nothing at this point.
				 */
				this._collectionAggregation.push(...[
					{
						$lookup : {
							from         : getModelCollectionName(meta.relatedModel),
							localField   : meta.localKey,
							foreignField : meta.foreignKey,
							as           : meta.propertyKey + 'Temp'
						},
					},
					{
						$addFields : {
							[meta.propertyKey] : {
								'$first' : `$${meta.propertyKey}Temp`
							}
						},
					},
					{
						$unset : [`${meta.propertyKey}Temp`]
					}
				]);
			}

			if (meta.type === ModelRelationType.HAS_MANY) {
				/**
				 * Basically the same as a MySQL join
				 */
				this._collectionAggregation.push({
					$lookup : {
						from         : getModelCollectionName(meta.relatedModel),
						localField   : meta.localKey,
						foreignField : meta.foreignKey,
						as           : meta.propertyKey
					},
				});
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
		this._collectionFilter = {
			...this._collectionFilter,
			...{[key] : {$exists : existState}}
		};

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
	 * Check if a property on the model is part of a relationship
	 *
	 * @param {string} key
	 * @param {ModelRelationType} type
	 * @returns {boolean}
	 */
	public isRelation(key: string, type?: ModelRelationType): boolean {
		const relations = [...this._hasManyRelations, ...this._hasOneRelations];

		return relations.some(relation => {
			if (type) {
				return relation.propertyKey === key && relation.type === type;
			}

			return relation.propertyKey === key;
		});
	}

	/**
	 * Get an object of all relations on this model as an object
	 * Key is the relation property, value is the meta registered
	 *
	 * @returns {ModelRelationMeta[]}
	 */
	public relations(): { [key: string]: ModelRelationMeta } {
		const relations = {};

		for (let modelRelationMeta of [...this._hasOneRelations, ...this._hasManyRelations]) {
			relations[modelRelationMeta.propertyKey] = modelRelationMeta;
		}

		return relations;
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
	 * Get the first result in the mongo Cursor
	 *
	 * @template T
	 * @returns {Promise<T>}
	 */
	public async first(): Promise<T> {
		await this.resolveFilter();

		let result = await this._builderResult.limit(1).next();

		if (!result) {
			this.cleanupBuilder();

			return null;
		}

		result = hydrateModel(result, this._model.constructor as any);

		this.cleanupBuilder();

		return result;
	}

	/**
	 * Get all items from the collection that match the query
	 *
	 * @template T
	 * @returns {Promise<T[]>}
	 */
	public async get(): Promise<T[]> {
		const cursor = await this.resolveFilter();

		const results = (await cursor.toArray()).map(
			result => hydrateModel(result, this._model.constructor as unknown as ClassType<T>)
		);

		this.cleanupBuilder();

		return results;
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
	public async update(
		attributes: UpdateQuery<T> | Partial<T>,
		options?: UpdateManyOptions & { returnMongoResponse: boolean }
	): Promise<boolean | UpdateWriteOpResult> {
		const response = await this._model.collection().updateMany(
			this._collectionFilter,
			attributes,
			options
		);

		if (options?.returnMongoResponse) {
			return response;
		}

		this._model.setMongoResponse(response);

		return !!response?.result?.ok;
	}

	/**
	 * Get an instance of the underlying mongo cursor
	 *
	 * @template T
	 * @returns {Promise<Cursor<T>>}
	 */
	public async cursor(): Promise<Cursor<T>> {
		return this._builderResult;
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
	 * Delete any items from the collection specified in the where() clause
	 *
	 * @returns {Promise<boolean>}
	 */
	public async delete(): Promise<boolean> {
		const deleteOperation = await this._model
			.collection()
			.deleteMany(this._collectionFilter);

		return !!deleteOperation.result.ok;
	}

	/**
	 * Returns the count of items, filters if one was specified with .where()
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
	 * @returns integer
	 */
	public count(): Promise<number> {
		return this._model.collection().countDocuments(this._collectionFilter);
	}

	/**
	 * Paginate the results
	 *
	 * @param {number} limit
	 * @returns {PaginatorContract<{}>}
	 */
	public async paginate(limit: number = 20): Promise<PaginatorContract<T>> {
		this.limit(limit);

		const paginator = new Paginator(
			this._model,
			this._collectionFilter,
			this._limit
		);

		await paginator.getResults();

		return paginator;
	}

	/**
	 * When a filter has been specified with where(). It will apply to
	 * {@see _collectionFilter} then when we make other calls, like
	 * .get(), .first() or .count() it will resolve the cursor
	 * or use it to make further mongodb calls.
	 *
	 * @private
	 */
	public resolveFilter() {
		const options = {} as WithoutProjection<FindOneOptions<T>>;

		if (this._collectionOrder && this._collectionOrder?.direction) {
			options.sort                            = {};
			options.sort[this._collectionOrder.key] = this._collectionOrder.direction;
		}

		if (this._limit) {
			options.limit = this._limit;
		}

		if (this._collectionAggregation?.length) {
			const aggregation = [
				{$match : this._collectionFilter},
				...this._collectionAggregation
			];

			this._builderResult = this._model
				.collection()
				.aggregate<T>(aggregation);

			return this._builderResult;
		}

		this._builderResult = this._model
			.collection()
			.find(this._collectionFilter, options);

		return this._builderResult;
	}

	public get collectionFilter() {
		return this._collectionFilter;
	}

	/**
	 * Convert a regular comparison operator to mongoDB's version
	 * @param {QueryOperator} operator
	 * @returns {string}
	 */
	public parseQueryOperator(operator: QueryOperator) {
		switch (operator) {
			case "==":
			case "=":
				return "$eq";
			case "!==":
			case "!=":
			case "<>":
				return "$ne";
			case ">":
				return "$gt";
			case ">=":
				return "$gte";
			case "<":
				return "$lt";
			case "<=":
				return "$lte";
		}
	}

	/**
	 * After we have resolved our query, we need to make sure we clear everything
	 * up, just so that filters don't remain and cause unexpected issues
	 * @private
	 */
	public cleanupBuilder() {
		this._builderResult         = null;
		this._collectionFilter      = null;
		this._collectionAggregation = null;
		this._collectionOrder       = null;
		this._limit                 = null;
	}

}
