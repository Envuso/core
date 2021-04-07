import {InvalidRefSpecified} from "@Core/Exceptions/Models/InvalidRefSpecified";
import {ModelEntity, Ref, Repository} from "@Core/Providers";
import {Cursor, FilterQuery, FindOneOptions, UpdateManyOptions, WithoutProjection} from "mongodb";


interface CollectionOrder {
	direction: 1 | -1,
	key: string,
}

export class QueryBuilder<T> {

	/**
	 * When we call any internal mongo methods to query a collection
	 * we'll store it's instance here so that we can use chaining.
	 *
	 * @private
	 */
	private _builderResult: Cursor<T>;

	private _model: ModelEntity<T>;

	private _collectionFilter: object = null;

	private _collectionAggregation: object[] = [];

	private _collectionOrder: CollectionOrder | null = null;

	constructor(model: ModelEntity<T>) {
		this._model = model;
	}

	/**
	 * Similar to using collection.find()
	 *
	 * @param attributes
	 */
	public where<M>(attributes: Partial<M>): QueryBuilder<T> {
		this._collectionFilter = attributes;

		return this;
	}

	public with(...refsToLoad: (keyof T)[]): QueryBuilder<T> {

		const refs = Reflect.getMetadata('mongo:refs', this._model) || {};

		for (let ref of refsToLoad) {

			const refInfo: Ref = refs[ref];

			if (!refInfo) {
				throw new InvalidRefSpecified(this._model.constructor.name, String(ref));
			}

			this._collectionAggregation.push({
				$lookup : {
					from         : ModelEntity.formatNameForCollection(refInfo.modelName, true),
					localField   : refInfo._id,
					foreignField : '_id',
					as           : ref
				}
			});

			if (!refInfo.array) {
				this._collectionAggregation.push({
					$unwind : {
						path                       : '$' + ModelEntity.formatNameForCollection(refInfo.modelName, refInfo.array),
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
	orderByDesc(key: keyof T | string) {
		this._collectionOrder = {
			key       : String(key),
			direction : -1
		}

		return this;
	}

	/**
	 * Allows us to specify an order of ascending, which is applied to the cursor
	 *
	 * @param key
	 */
	orderByAsc(key: keyof T | string) {
		this._collectionOrder = {
			key       : String(key),
			direction : 1
		};

		return this;
	}

	/**
	 * When a filter has been specified with where(). It will apply to
	 * {@see _collectionFilter} then when we make other calls, like
	 * .get(), .first() or .count() it will resolve the cursor
	 * or use it to make further mongodb calls.
	 *
	 * @private
	 */
	private resolveFilter() {
		const options = {} as WithoutProjection<FindOneOptions<T>>;

		if (this._collectionOrder && this._collectionOrder?.direction) {
			options.sort                            = {};
			options.sort[this._collectionOrder.key] = this._collectionOrder.direction;
		}

		if (this._collectionAggregation?.length) {
			const aggregation = [
				{$match : this._collectionFilter},
				...this._collectionAggregation
			]

			this._builderResult = this._model
				.repository().c
				.aggregate<T>(aggregation);

			return this._builderResult;
		}

		this._builderResult = this._model
			.repository().c
			.find(this._collectionFilter, options);

		return this._builderResult;
	}

	/**
	 * Get the first result in the mongo Cursor
	 */
	async first() {
		await this.resolveFilter();

		const result = await this._builderResult.limit(1).next();

		if (!result) return null;

		return this._model.repository().hydrate(result);
	}

	/**
	 * Get all items from the collection that match the query
	 */
	async get() {
		const cursor = await this.resolveFilter();

		const results = await cursor.toArray();

		return results.map(
			result => this._model.repository().hydrate(result)
		);
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
	public async update(attributes: Partial<T>, options?: UpdateManyOptions & { returnMongoResponse: boolean }) {
		const response = await this._model.repository().c.updateMany(
			this._collectionFilter,
			{
				$set : attributes
			},
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
	async cursor(): Promise<Cursor<T>> {
		return this._builderResult;
	}

	/**
	 * Returns the count of items, filters if one was specified with .where()
	 */
	public count() {
		return this._model.repository().count(this._collectionFilter);
	}


}
