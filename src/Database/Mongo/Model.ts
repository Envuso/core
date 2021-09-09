import {config, resolve} from "../../AppContainer";
import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {Collection, FilterQuery, FindOneOptions, ObjectId, ReplaceOneOptions, UpdateQuery, WithoutProjection} from "mongodb";
import pluralize from 'pluralize';
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {ModelProps} from "../index";
import {ModelDecoratorMeta} from "../ModelDecorators";
import {convertEntityObjectIds, dehydrateModel, getModelObjectIds, hydrateModel} from "../Serialization/Serializer";
import {QueryBuilder} from "./QueryBuilder";


export class Model<M> implements ModelContract<M> {

	/**
	 * We'll store the result of the recent mongo request if there
	 * is one. This way we always have access to it, and can return
	 * generic true/false types of responses for some operations.
	 */
	@Exclude()
	public _recentMongoResponse: any = null;

	@Exclude()
	public readonly _queryBuilder: QueryBuilder<M>;

	constructor() {
		this._queryBuilder = new QueryBuilder<M>(this);
	}

	/**
	 * Access the underlying mongo collection for this model
	 */
	public collection(): Collection<M> {
		return resolve<Collection<M>>(this.constructor.name + 'ModelCollection');
	}

	/**
	 * Get an instance of the mongo repository
	 */
	static getCollection<T extends Model<any>>(this: new() => T): Collection<T> {
		return resolve<Collection<T>>(this.name + 'ModelCollection');
	}

	/**
	 * Get the query builder instance
	 */
	public queryBuilder(): QueryBuilderContract<M> {
		return this._queryBuilder;
	}

	/**
	 * Load the specified relations just for this model
	 *
	 * @param {keyof ModelProps<M>} relations
	 * @returns {Promise<this>}
	 */
	public async load(...relations: (keyof ModelProps<M>)[]): Promise<this> {
		const result = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.with(...relations)
			.first();

		for (let relation of relations) {
			if (!result[relation]) {
				continue;
			}

			(this as any)[relation] = result[relation];
		}

		return this;
	}

	/**
	 * Get an instance of query builder, similar to using collection.find()
	 * But... our query builder returns a couple of helper methods, first(), get()
	 *
	 * This method proxies right through to the query builder.
	 *
	 * {@see QueryBuilder}
	 *
	 * @param attributes
	 * @param key
	 * @param value
	 */
	static where<T extends Model<any>>(this: new() => T, attributes: FilterQuery<T> | Partial<T>, key?: string, value?: any): QueryBuilderContract<T> {
		return new this().queryBuilder().where<T>(attributes);
	}

	/**
	 * Allows us to do a query for an item that exists in the array.
	 * For example, we have documents with usernames, jane, bill, bob.
	 *
	 * We can do .whereIn('username', ['jane', 'bill'])
	 *
	 * {@see QueryBuilder}
	 *
	 * @param key
	 * @param values
	 */
	whereIn<F extends (keyof M)>(key: F, values: M[F][]): QueryBuilderContract<M> {
		return this.queryBuilder().whereIn(key, values);
	}

	static whereIn<T extends Model<any>, F extends (keyof T)>(
		this: new() => T,
		key: F,
		values: T[F][]
	): QueryBuilderContract<T> {
		return new this().whereIn(key, values);
	}

	static query<T extends Model<any>>(
		this: new() => T,
	): QueryBuilderContract<T> {
		return new this().queryBuilder();
	}

	static when<T extends Model<any>>(
		this: new() => T,
		condition: boolean | (() => boolean),
		attributes: FilterQuery<T> | Partial<T>
	): QueryBuilderContract<T> {
		if (typeof condition === 'boolean' && !condition) {
			return new this().queryBuilder();
		}

		if (typeof condition === 'function' && !condition()) {
			return new this().queryBuilder();
		}

		return new this().queryBuilder().where<T>(attributes);
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
	 * Paginate all data on the collection
	 */
	public static paginate<T extends Model<any>>(
		this: new() => T,
		limit: number = 20
	): Promise<PaginatorContract<T>> {
		return new this().queryBuilder().paginate(limit);
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
		const objectId = getModelObjectIds(new this()).find(f => f.name === field);

		if (objectId !== undefined) {
			key = new ObjectId(key);
		}

		return new this().queryBuilder()
			.where<T>({[field] : key})
			.first();
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
	): QueryBuilderContract<T> {
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
	): QueryBuilderContract<T> {
		return new QueryBuilder<T>(new this()).orderByAsc(key);
	}

	/**
	 * Sometimes we just want a simple way to check if
	 * a document exists with the specified fields
	 *
	 * @param {FilterQuery<T>} query
	 * @returns {Promise<boolean>}
	 */
	static async exists<T extends Model<any>>(
		this: new() => T,
		query: FilterQuery<T>
	) {
		const result = await new this().collection().findOne(query);

		return !!result;
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

		const createdEntIty = await collection.insertOne(
			dehydrateModel(hydrateModel(attributes, this))
		);

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
	public async update(
		attributes: UpdateQuery<M> | Partial<M>,
		options: ReplaceOneOptions = {}
	): Promise<M> {
		//		const plain = dehydrateModel({...this, ...attributes});

		const attributeChecks = attributes as UpdateQuery<M>;

		// Update queries in mongo require atomic operators...
		// We'll check if any of the mongo atomic operators are defined
		// in the update query... if so, then we'll manually call $set
		// This will allow us to use both kinds of updates

		let usesAtomicOperator = false;
		for (let key of Object.keys(attributeChecks)) {
			if (this.getMongoAtomicOperators().includes(key)) {
				usesAtomicOperator = true;
				break;
			}
		}

		if (!usesAtomicOperator) {
			// We want to iterate over the attributes to actually ensure they're a property
			// of our model. Without this, random properties can be saved onto our document.
			const attributesToSet = {};
			for (let attributesKey in attributes) {
				if (this[attributesKey] === undefined) {
					continue;
				}
				attributesToSet[attributesKey] = attributes[attributesKey];
			}

			//@ts-ignore - some silly type issue i cba to figure out rn
			attributes = {$set : attributesToSet};
		}

		await this.collection().updateOne({
			'_id' : (this as any)._id
		}, attributes, options);

		const updatedModel = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.first();

		Object.assign(this, updatedModel);

		return updatedModel;

		// await this.collection().replaceOne({
		// 	_id : (this as any)._id
		// }, plain as any, options);

		// for (let attributesKey in attributes) {
		// 	(this as any)[attributesKey] = attributes[attributesKey];
		// }

		// await this.refresh();

		//		return this;
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
	public async save(): Promise<this> {
		//If the model hasn't been persisted to the db yet... we'll
		//dehydrate it, insert it to the db, then add the id to the model
		if (this.isFresh()) {
			const plain = dehydrateModel(this);

			const res = await this.collection().insertOne(plain as any);

			(this as any)._id  = res.insertedId;
			(plain as any)._id = res.insertedId;

			const modelObjectIds = convertEntityObjectIds(this, plain);
			for (let modelObjectIdsKey in modelObjectIds) {
				this[modelObjectIdsKey] = modelObjectIds[modelObjectIdsKey];
			}

			return;
		}

		await this.update(dehydrateModel(this as any));

		return this;
	}

	/**
	 * Has this model been persisted to the database yet?
	 * @returns {boolean}
	 */
	public isFresh(): boolean {
		return this.getModelId() === undefined;
	}

	/**
	 * Get the current models id
	 *
	 * @returns {ObjectId}
	 */
	public getModelId(): ObjectId {
		return (this as any)?._id;
	}

	/**
	 * Get all the properties from the database for this model
	 */
	public async refresh(): Promise<this> {
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
	public async delete(): Promise<boolean> {
		const response = await this.collection().deleteOne({_id : (this as any)._id});

		return !!response.result.ok;
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
	 * @param {T[] | Partial<T>[]} models
	 * @returns {Promise<{success: boolean, ids: ObjectId[]}>}
	 */
	public static async insertMany<T extends Model<any>>(
		this: new() => T,
		models: T[] | Partial<T>[]
	): Promise<{ success: boolean, ids: ObjectId[] }> {
		const formattedModels = models.map(model => {
			if (!(model instanceof this)) {
				model = hydrateModel(model, this);
			}

			return dehydrateModel(model);
		});

		const result = await new this().collection().insertMany(formattedModels);

		const wasSuccessful = result.result.ok && (result.result.n === formattedModels.length);

		return {
			success : wasSuccessful,
			ids     : Object.values(result.insertedIds),
		};
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
	public toJSON() {
		const options = config().get<string, any>('Server').responseSerialization as ClassTransformOptions;

		return classToPlainFromExist(
			this,
			{},
			options
		);
	}

	public toBSON() {
		return dehydrateModel(this);
	}

	public getMongoAtomicOperators() {
		return [
			"$currentDate",
			"$inc",
			"$min",
			"$max",
			"$mul",
			"$rename",
			"$set",
			"$setOnInsert",
			"$unset",
			"$addToSet",
			"$pop",
			"$pull",
			"$push",
			"$pullAll",
			"$bit",
		];
	}

	/**
	 * Make it a tad cleaner to get meta from this model
	 *
	 * @param {ModelDecoratorMeta} metaKey
	 * @param _default
	 * @returns {T}
	 */
	public getMeta<T>(metaKey: ModelDecoratorMeta, _default: any = null): T {
		return (Reflect.getMetadata(metaKey, this) ?? _default) as T;
	}

}


