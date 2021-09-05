import {Cursor, FilterQuery, FindOneOptions, UpdateManyOptions, UpdateQuery, UpdateWriteOpResult, WithoutProjection} from "mongodb";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {CollectionOrder, QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {ClassType, Ref} from "../index";
import {hydrateModel} from "../Serialization/Serializer";
//import {Model} from "./Model";
import {Paginator} from "./Paginator";

export class QueryBuilder<T> implements QueryBuilderContract<T> {

	/**
	 * When we call any internal mongo methods to query a collection
	 * we'll store it's instance here so that we can use chaining.
	 *
	 * @private
	 */
	public _builderResult: Cursor<T>;

	/**
	 * An instance of the model to use for interaction
	 *
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

	constructor(model: ModelContract<T>) {
		this._model = model;
	}

	/**
	 * Similar to using collection.find()
	 *
	 * @param attributes
	 */
	public where<M>(attributes: FilterQuery<M | T> | Partial<M | T>): QueryBuilderContract<T> {
		this._collectionFilter = {...this._collectionFilter, ...attributes};

		return this;
	}

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
	 * @param refsToLoad
	 */
	public with(...refsToLoad: (keyof T)[]): QueryBuilderContract<T> {

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
	 * Allows us to specify an order of descending, which is applied to the cursor
	 *
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
