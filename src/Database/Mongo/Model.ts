import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {Collection, FilterQuery, FindOneOptions, ObjectId, ReplaceOneOptions, WithoutProjection} from "mongodb";
import pluralize from 'pluralize';
import {config, resolve} from "../../AppContainer";
import {dehydrateModel, hydrateModel} from "../Serialization/Serializer";
import {QueryBuilder} from "./QueryBuilder";


export class Model<M> {

	/**
	 * We'll store the result of the recent mongo request if there
	 * is one. This way we always have access to it, and can return
	 * generic true/false types of responses for some operations.
	 */
	@Exclude()
	private _recentMongoResponse: any = null;

	@Exclude()
	private readonly _queryBuilder: QueryBuilder<M>;

	constructor() {
		this._queryBuilder = new QueryBuilder<M>(this);
	}

	/**
	 * Access the underlying mongo collection for this model
	 */
	collection(): Collection<M> {
		return resolve<Collection<M>>(this.constructor.name + 'Model');
	}

	/**
	 * Get the query builder instance
	 */
	queryBuilder(): QueryBuilder<M> {
		return this._queryBuilder;
	}

	/**
	 * Get an instance of query builder, similar to using collection.find()
	 * But... our query builder returns a couple of helper methods, first(), get()
	 * {@see QueryBuilder}
	 *
	 * @param attributes
	 */
	static where<T extends Model<any>>(
		this: new() => T,
		attributes: FilterQuery<T> | Partial<T>
	): QueryBuilder<T> {
		return new this().queryBuilder().where<T>(attributes);
	}

	/**
	 * Get an instance of the mongo repository
	 */
	static getCollection<T extends Model<any>>(this: new() => T): Collection<T> {
		return resolve<Collection<T>>(this.name + 'Model');
	}

	/**
	 * Query for a single model instance
	 *
	 * @param query
	 */
	static async findOne<T extends Model<any>>(
		this: new() => T,
		query: FilterQuery<T | { _id: any }> = {}
	): Promise<T | null> {
		const model = await new this().collection().findOne<Object>(query as any);

		return hydrateModel(model, this);
	}

	/**
	 * calls mongodb.find function and returns its cursor with attached map function that hydrates results
	 * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
	 */
	static async get<T extends Model<any>>(
		this: new() => T,
		query?: FilterQuery<T | { _id: any }>,
		options?: WithoutProjection<FindOneOptions<T>>
	): Promise<T[]> {
		const cursor  = await new this().collection().find(query as any, options);
		const results = await cursor.toArray();

		return results.map(doc => hydrateModel(doc, this));
	}

	/**
	 * Count all the documents in the collection
	 */
	public static async count(): Promise<number> {
		return this.where({}).count();
	}

	/**
	 * Allows us to efficiently load relationships
	 * one to many
	 *
	 * @param refs
	 */
	static with<T extends Model<any>>(
		this: new() => T,
		...refs: (keyof T)[]
	): QueryBuilder<T> {
		return new this().queryBuilder().with(...refs);
	}

	/**
	 * Find an item using it's id and return it as a model.
	 *
	 * @param key
	 * @param field
	 */
	static find<T extends Model<any>>(
		this: new() => T,
		key: string | ObjectId,
		field: keyof T | '_id' = '_id'
	): Promise<T> {
		return new this().queryBuilder()
			.where<T>({
				[field] : field === '_id' ? new ObjectId(key) : key
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
	static orderByDesc<T extends Model<any>>(
		this: new() => T,
		key: keyof T
	): QueryBuilder<T> {
		return new QueryBuilder<T>(new this()).orderByDesc(key);
	}

	/**
	 * Basically an alias of the {@see QueryBuilder.orderByAsc()}
	 * that allows us to order and call get() or first()
	 *
	 * @param key
	 */
	static orderByAsc<T extends Model<any>>(
		this: new() => T,
		key: keyof T
	): QueryBuilder<T> {
		return new QueryBuilder<T>(new this()).orderByAsc(key);
	}

	/**
	 * Create a new instance of this model and store it in the collection
	 *
	 * @param {Partial<M>} attributes
	 */
	static async create<T extends Model<any>>(
		this: new() => T,
		attributes: Partial<T>
	): Promise<T> {
		const collection = new this().collection();

		const createdEntIty = await collection.insertOne(attributes);

		const newEntity = await collection.findOne({
			_id : createdEntIty.insertedId
		});

		return hydrateModel(newEntity, this);
	}

	/**
	 * Update this model
	 *
	 * @param attributes
	 * @param options
	 */
	async update(
		attributes: Partial<M>,
		options: ReplaceOneOptions = {}
	): Promise<this> {
		const plain = dehydrateModel({...this, ...attributes});

		await this.collection().replaceOne({
			_id : (this as any)._id
		}, plain as any, options);

		for (let attributesKey in attributes) {
			(this as any)[attributesKey] = attributes[attributesKey];
		}

		//		await this.refresh();

		return this;
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
	async save(): Promise<this> {
		//If the model hasn't been persisted to the db yet... we'll
		//dehydrate it, insert it to the db, then add the id to the model
		if (this.isFresh()) {
			const plain = dehydrateModel(this);

			const res = await this.collection().insertOne(plain as any);

			(this as any)._id  = res.insertedId;
			(plain as any)._id = res.insertedId;

			return;
		}

		await this.update(this as any);

		return this;
	}

	/**
	 * Has this model been persisted to the database yet?
	 * @returns {boolean}
	 */
	isFresh(): boolean {
		return !!(this as any)?._id;
	}

	/**
	 * Get all the properties from the database for this model
	 */
	async refresh(): Promise<this> {
		const newVersion = await this.queryBuilder()
			.where({_id : (this as any)._id})
			.first();

		//		Object.keys(newVersion).forEach(key => this[key] = newVersion[key]);
		Object.assign(this, newVersion);

		return this;
	}

	/**
	 * Delete the current model instance from the collection
	 */
	async delete() {
		await this.collection().deleteOne({_id : (this as any)._id});
	}

	public mongoResponse(): any {
		return this._recentMongoResponse;
	}

	public setMongoResponse(response: any): any {
		this._recentMongoResponse = response;
	}

	/**
	 * Will return a correctly formatted name for the underlying mongo collection
	 */
	public collectionName(many: boolean = false) {
		return Model.formatNameForCollection(this.constructor.name, many);
	}

	static formatNameForCollection(str: string, many: boolean = false) {
		return String(pluralize(str, many ? 2 : 1)).toLowerCase();
	}

	/**
	 * When this model instance is returned in a
	 * response, we'll make sure to use classToPlain so
	 * that any @Exclude() properties etc are taken care of.
	 */
	toJSON() {
		const options = config('server.responseSerialization') as ClassTransformOptions;

		return classToPlainFromExist(
			this,
			{},
			options
		);
	}

}


