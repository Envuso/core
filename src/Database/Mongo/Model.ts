import {classToPlain, classToPlainFromExist, plainToClass} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import _, {update} from 'lodash';
import {Collection, Filter, FindOptions, ObjectId, OptionalId, UpdateOptions, UpdateResult,} from "mongodb";
import pluralize from 'pluralize';
import {config, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {Database, ModelDecoratorMeta, ModelIndex, transformFromObjectIds, transformToObjectIds} from "../index";
import {ModelAttributesFilter, ModelAttributesUpdateFilter, ModelProps, SingleModelProp} from "../QueryBuilderTypes";
import {convertEntityObjectIds} from "../Serialization/Serializer";
import {ModelHelpers} from "./ModelHelpers";
import {QueryBuilder} from "./QueryBuilder";

export class Model<M> implements ModelContract<M> {


	constructor(attributes: Partial<M> = {}, isTemporary: boolean = false) {
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
		return QueryBuilder.fromContainer<M>(this as any);
	}

	static query<T extends Model<any>>(this: new() => T): QueryBuilderContract<T> {
		//		return instance(this).queryBuilder();
		//		return new QueryBuilder<T>(tempInstance(this) as any);
		//		return new this().queryBuilder();

		return QueryBuilder.fromContainer<T>(this);
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

		const relationAttributes = {};

		for (let relation of relations) {
			if (!result[relation]) {
				continue;
			}

			if (!this.isAttribute(relation)) {
				continue;
			}

			relationAttributes[relation as string] = result[relation];
		}

		this.assignAttributes(relationAttributes);

		return this;
	}

	/**
	 * Query for a single model instance
	 *
	 * @param query
	 */
	static async findOne<T extends Model<any>>(this: new() => T, query: Filter<T | { _id: any }> = {}): Promise<T | null> {
		return await QueryBuilder.fromContainer<T>(this).where(query).first();
	}

	/**
	 * calls mongodb.find function and returns its cursor with attached map function that hydrates results
	 * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
	 */
	static async get<T extends Model<any>>(
		this: new() => T,
		query?: ModelAttributesFilter<T | { _id: any }>,
		options?: FindOptions<T>
	): Promise<T[]> {
		return await QueryBuilder.fromContainer<T>(this).where(query).get(options);
	}

	/**
	 * Count all the documents in the collection
	 */
	public static async count(): Promise<number> {
		return this.query().where({}).count();
	}

	/**
	 * Find an item using it's id and return it as a model.
	 *
	 * @param key
	 * @param field
	 */
	static find<T extends Model<any>>(this: new() => T, key: string | ObjectId, field: keyof T | '_id' = '_id'): Promise<T> {
		return QueryBuilder.fromContainer<T>(this).where({[field] : key}).first();
	}

	/**
	 * Create a new instance of this model from the specified attributes
	 *
	 * This will not be persisted to the database unless {@see save()} is called
	 *
	 * @param {Partial<T> | T} attributes
	 * @returns {T}
	 */
	static make<T extends Model<any>>(this: new () => T, attributes: Partial<T> | T): T {
		if (!(_.isPlainObject(attributes)) && (attributes instanceof Model)) {
			attributes = attributes.getAttributes();
		}

		let model = new this();
		model     = model.hydrate(attributes);
		model.assignAttributes(attributes, true);

		return model;
	}

	/**
	 * Create a new instance of this model and store it in the collection
	 *
	 * @param {Partial<M>} attributes
	 */
	static async create<T extends Model<any>>(this: new () => T, attributes: Partial<T>): Promise<T> {
		let model = new this();
		model     = model.hydrate(attributes);

		return model.hydrate(
			await model.queryBuilder().create(model.dehydrate())
		);

		//const collection = model.collection();
		//
		//const createdEntIty = await collection.insertOne(
		//	//dehydrateModel(hydrateModel(attributes, this))
		//	ModelHelpers.convertObjectIdsInAttributes(model, model.dehydrate())
		//);
		//
		//return model.hydrate(
		//	await collection.findOne({_id : createdEntIty.insertedId})
		//);
	}

	/**
	 * Update this model
	 *
	 * @param attributes
	 * @param options
	 */
	public async update(attributes: ModelAttributesUpdateFilter<M>, options?: UpdateOptions & { returnMongoResponse: boolean }): Promise<boolean | UpdateResult> {

		const updated = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.update(attributes);

		const keys = Object.keys(attributes);

		const updatedModel = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.selectFields(...keys)
			.first();

		this.assignUpdatedAttributes(_.pick(updatedModel, keys), keys, true);

		return updated;
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
			const plain = this.dehydrateForQuery();

			const res = await this.collection().insertOne(plain);

			(this as any)._id  = res.insertedId;
			(plain as any)._id = res.insertedId;

			//			const modelObjectIds = convertEntityObjectIds(this, plain);
			//			for (let modelObjectIdsKey in modelObjectIds) {
			//				this[modelObjectIdsKey] = modelObjectIds[modelObjectIdsKey];
			//			}

			this.assignAttributes(plain as Partial<M>);

			return;
		}

		await this.update(this.dehydrate());

		return this;
	}

	/**
	 * Has this model been persisted to the database yet?
	 * @returns {boolean}
	 */
	public isFresh(): boolean {
		return (this as any)._id === undefined;
	}

	/**
	 * Get the current models id
	 *
	 * @returns {ObjectId}
	 */
	public getModelId(): ObjectId {
		return new ObjectId((this as any)?._id);
	}

	/**
	 * Get all the properties from the database for this model
	 */
	public async refresh(): Promise<this> {
		const newVersion = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.first();

		this.assignAttributes(newVersion);

		return this;
	}

	/**
	 * Delete the current model instance from the collection
	 */
	public async delete(): Promise<boolean> {
		const response = await this.collection().deleteOne({_id : this.getModelId()});

		return !!response.acknowledged;
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
	public static async insertMany<T extends Model<any>>(this: new() => T, models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }> {
		return QueryBuilder.fromContainer<T>(this).insertMany(models);
	}

	/**
	 * This method just calls {@see insertMany}
	 * I find it's nice to just have different naming
	 * Sometimes our brains go for insertMany, sometimes createMany.
	 *
	 * @param {T[] | Partial<T>[]} models
	 * @returns {Promise<{success: boolean, ids: ObjectId[]}>}
	 */
	public static createMany<T extends Model<any>>(this: new() => T, models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }> {
		return QueryBuilder.fromContainer<T>(this).insertMany(models);
	}

	/**
	 * Will return a correctly formatted name for the underlying mongo collection
	 */
	public collectionName(many: boolean = false) {
		return Model.formatNameForCollection(this.constructor.name, many);
	}

	public getAttributes(): Partial<M> {
		const fields = this.getModelFields();

		const attributes = {};

		for (let field of fields) {
			attributes[field] = this[field];
		}

		return attributes;
	}

	public isAttribute(key: SingleModelProp<M>): boolean {
		return this.getModelFields().includes(key as string);
	}

	public assignUpdatedAttributes(attributes: Partial<M>, updatedKeys: string[], ignoreFieldChecks: boolean = false): void {
		const fields = this.getModelFields();

		attributes = ModelHelpers.convertObjectIdsInAttributes(this, attributes);

		if (!_.has(attributes, updatedKeys)) {
			Log.warn(`Key does not exist in updated keys: ${updatedKeys} - attributes: ${attributes}`);
		}

		for (let attributeKey in attributes) {
			const key = attributeKey as string;

			if (!ignoreFieldChecks) {
				if (!fields.includes(key)) {
					Log.label('Model->assignAttributes').warn('Trying to assign a key which doesnt exist in model fields. This property will be skipped.');
					Log.label('Model->assignAttributes').warn(`Key: ${key}, Model: ${this.constructor.name}, Available fields: ${fields}`);

					continue;
				}
			}

			_.set(this, key, attributes[key]);
			//this[key] = attributes[key];
		}
	}

	public assignAttributes(attributes: Partial<M>, ignoreFieldChecks: boolean = false): void {
		const fields = this.getModelFields();

		attributes = ModelHelpers.convertObjectIdsInAttributes(this, attributes);

		for (let attributeKey in attributes) {
			const key = attributeKey as string;

			if (!ignoreFieldChecks) {
				if (!fields.includes(key)) {
					Log.label('Model->assignAttributes').warn('Trying to assign a key which doesnt exist in model fields. This property will be skipped.');
					Log.label('Model->assignAttributes').warn(`Key: ${key}, Model: ${this.constructor.name}, Available fields: ${fields}`);

					continue;
				}
			}

			this[key] = attributes[key];
		}
	}

	public hydrate(attributes: Partial<M>): M {
		// Reeeeeeeee.....
		return (this.constructor as any).hydrate(attributes) as unknown as M;
	}

	public static hydrate<T extends Model<any>>(this: new() => T, attributes: Partial<T>) {
		return plainToClass<T, Object>(this, attributes, {
			ignoreDecorators  : true,
			exposeUnsetFields : false,
		});
	}

	public static hydrateUsing<T extends Model<any>>(model: new() => T, attributes: Partial<T>) {
		return plainToClass<T, Object>(model, attributes, {
			ignoreDecorators  : true,
			exposeUnsetFields : false,
		});
	}

	public dehydrateForQuery(): OptionalId<M> {
		// Also Reeeeeeeee.....
		return (this.constructor as any).dehydrate(this) as any;
	}

	public dehydrate(): object {
		// Also more Reeeeeeeee.....
		return (this.constructor as any).dehydrate(this) as any;
	}

	public static dehydrate<T extends Model<any>>(this: new() => T, model: T): object {
		if (!model)
			return model;

		let plain: any = classToPlain(model, {
			enableCircularCheck : true,
			excludePrefixes     : ['_'],
			ignoreDecorators    : true
		});

		// const nested = Reflect.getMetadata('mongo:nested', model) || [];
		// for (let {name, array} of nested) {
		// 	if (plain[name]) {
		// 		if (!array) {
		// 			plain[name] = (this as new () => Model<any>).dehydrateModel(plain[name]);
		// 		} else {
		// 			plain[name] = plain[name].map((e: any) => dehydrateModel(e));
		// 		}
		// 	}
		// }

		const ignores = Reflect.getMetadata(ModelDecoratorMeta.IGNORED_PROPERTY, model) || {};
		for (const name in ignores) {
			delete plain[name];
		}

		//		plain = transformFromObjectIds(plain);

		const modelObjectIds = convertEntityObjectIds(model, plain);
		for (let modelObjectIdsKey in modelObjectIds) {
			plain[modelObjectIdsKey] = modelObjectIds[modelObjectIdsKey];
		}

		return plain;
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
		return this.dehydrate();
	}

	static formatNameForCollection(str: string, many: boolean = false) {
		return String(pluralize(str, many ? 2 : 1)).toLowerCase();
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

	public getModelFields(): string[] {
		return Database.getModelFieldsFromContainer(this.constructor.name);
	}

	public async createIndexes() {
		const indexes = this.getMeta<ModelIndex[]>(ModelDecoratorMeta.INDEX, []);

		if (!indexes.length) {
			return;
		}


		const indexesToCreate = indexes.map(i => ({name : i.name, key : i.index}));

		for (let index of indexesToCreate) {
			if (await this.collection().indexExists(index.name)) {
				await this.collection().dropIndex(index.name);
			}
		}

		const result = await this.collection().createIndexes(indexesToCreate);
	}

}

function getCollection<T extends Model<any>>(model: new() => T): Collection<T> {
	return resolve<Collection<T>>(this.name + 'ModelCollection');
}

