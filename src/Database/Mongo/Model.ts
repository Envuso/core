import {instanceToPlain, classToPlainFromExist, plainToInstance} from "class-transformer";
import type {ClassTransformOptions} from "class-transformer/types/interfaces";
import _ from 'lodash';
import {Collection, type Filter, type FindOptions, ObjectId, type OptionalId, type OptionalUnlessRequiredId, type UpdateOptions, type UpdateResult,} from "mongodb";
import pluralize from 'pluralize';
import {config, resolve} from "../../AppContainer/helpers";
import {Log} from "../../Common/Logger/Log";
import type {ModelContract, ModelContractConstructor} from "../../Contracts/Database/Mongo/ModelContract";
import type {QueryBuilderContract} from "../../Contracts/Database/Mongo/QueryBuilderContract";
import {Database} from "../Database";
import {ModelDecoratorMeta} from "../ModelDecorators";
import type {ModelDateField, ModelIndex} from "../index";
import {ModelHook, type ModelHookMetaData, type ModelHooksMeta} from "../ModelHooks";
import type {ModelAttributesFilter, ModelAttributesUpdateFilter, ModelProps, SingleModelProp} from "../QueryBuilderTypes";
import {convertEntityObjectIds} from "../Serialization/Serializer";
import {ModelHelpers} from "./ModelHelpers";
import {QueryBuilder} from "./QueryBuilder";
import {HasMany} from "./Relationships/HasMany";
import {HasOne} from "./Relationships/HasOne";

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

		// The document was deleted since this model was loaded: nothing to attach
		if (!result) {
			return this;
		}

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

	public hasMany<T extends Model<any>>(related: (new() => T), localKey: string, foreignKey: string): QueryBuilderContract<T> {
		return HasMany.create<T>(this, related, localKey, foreignKey).query();
	}

	public hasOne<T extends Model<any>>(related: (new() => T), localKey: string, foreignKey: string): QueryBuilderContract<T> {
		return HasOne.create<T>(this, related, localKey, foreignKey).query();
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
		options?: FindOptions
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
		model     = await model.callHook(ModelHook.BEFORE_CREATE, model);

		return await model.queryBuilder().create(model.dehydrate());
	}

	/**
	 * Update this model
	 *
	 * @param attributes
	 * @param options
	 */
	public async update(attributes: ModelAttributesUpdateFilter<M>, options?: UpdateOptions & { returnMongoResponse: boolean }): Promise<boolean | UpdateResult> {

		// Work on a copy: relations were deleted from the caller's object
		attributes = {...attributes};

		const tempRelations = {};
		const queryBuilder  = this.queryBuilder();

		for (let relation of queryBuilder.joinedRelationsArray()) {
			if (attributes[relation.propertyKey] === undefined) {
				continue;
			}

			tempRelations[relation.propertyKey] = attributes[relation.propertyKey];
			delete attributes[relation.propertyKey];
		}

		const id     = this.getModelId();
		const update = queryBuilder.parseAttributesForUpdateQuery(attributes);
		const keys   = Model.updatedTopLevelKeys(attributes);

		const restoreRelations = () => {
			for (let tempRelationsKey in tempRelations) {
				this[tempRelationsKey] = tempRelations[tempRelationsKey];
			}
		};

		if (options?.returnMongoResponse) {
			const {returnMongoResponse, ...updateOptions} = options;
			const result = await this.collection().updateOne({_id : id} as Filter<M>, update as any, updateOptions);
			await this.refreshKeys(keys);
			restoreRelations();

			return result;
		}

		// One round trip: update and read back the changed fields (it was an update, then a find)
		const {returnMongoResponse, ...updateOptions} = (options ?? {}) as any;
		const document = await this.collection().findOneAndUpdate({_id : id} as Filter<M>, update as any, {
			...updateOptions,
			returnDocument : 'after',
			projection     : Object.fromEntries(keys.map(key => [key, 1])),
		});

		if (document) {
			const hydrated = this.hydrate(document as any);
			this.assignUpdatedAttributes(_.pick(hydrated, keys), keys, true);
		}

		restoreRelations();

		return !!document;
	}

	/**
	 * Top-level fields an update touches: {name: 'x'} -> name; {$inc: {'stats.views': 1}} -> stats
	 */
	private static updatedTopLevelKeys(attributes: object): string[] {
		const keys = new Set<string>();

		for (const [key, value] of Object.entries(attributes)) {
			if (key.startsWith('$') && value && typeof value === 'object') {
				Object.keys(value).forEach(field => keys.add(field.split('.')[0]));
			} else {
				keys.add(key.split('.')[0]);
			}
		}

		return [...keys];
	}

	private async refreshKeys(keys: string[]) {
		const updatedModel = await this.queryBuilder()
			.where({_id : this.getModelId()})
			.selectFields(...keys as any)
			.first();

		if (updatedModel) {
			this.assignUpdatedAttributes(_.pick(updatedModel, keys), keys, true);
		}
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

			let model = await this.callHook(ModelHook.BEFORE_CREATE, this);

			const plain = model.dehydrateForQuery();

			const res = await this.collection().insertOne(plain as OptionalUnlessRequiredId<M>);

			(this as any)._id  = res.insertedId;
			(plain as any)._id = res.insertedId;

			this.assignAttributes(plain as Partial<M>);

			return this;
		}

		let model = await this.callHook(ModelHook.BEFORE_SAVE, this);

		await this.update(model.dehydrate());

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
		const id = (this as any)?._id;

		// new ObjectId(undefined) generates a random id, so refresh/update/delete on an
		// unsaved model silently targeted nothing
		if (id === undefined || id === null) {
			throw new Error(`${this.constructor.name} has no _id: save() it before using it as a stored document.`);
		}

		return id instanceof ObjectId ? id : new ObjectId(id);
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
		const response = await this.collection().deleteOne({_id : this.getModelId()} as Filter<M>);

		return response.deletedCount === 1;
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

	public isAttribute(key: SingleModelProp<M> | string): boolean {
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

	/**
	 * Check if a relationship is loaded.
	 * This can be slightly inaccurate also... if we load a relationship
	 * but there isn't a relation to actually load(ie, a user with a book, but it doesnt have a book stored)
	 * then the value of the relationship on the model will be null.
	 *
	 * @param {SingleModelProp<M>} relationship
	 * @returns {boolean}
	 */
	public relationIsLoaded(relationship: SingleModelProp<M>): boolean {
		if (!this.isAttribute(relationship)) {
			return false;
		}

		if (!this.queryBuilder().isRelation(relationship as string)) {
			return false;
		}

		return !!this[relationship as string];
	}

	public hydrate(attributes: Partial<M>): M {
		// Reeeeeeeee.....
		return (this.constructor as any).hydrate(attributes) as unknown as M;
	}

	public static hydrate<T extends Model<any>>(this: new() => T, attributes: Partial<T>) {
		return plainToInstance<T, Object>(this, attributes, {
			ignoreDecorators  : true,
			exposeUnsetFields : false,
		});
	}

	public static hydrateUsing<T extends Model<any>>(model: new() => T, attributes: Partial<T>) {
		return plainToInstance<T, Object>(model, attributes, {
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

		let plain: any = instanceToPlain(model, {
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
	 * response, we'll make sure to use instanceToPlain so
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

	public isDateField(field: string): [boolean, string, (ModelDateField | undefined)] {
		const dates = this.getMeta<ModelDateField[]>(ModelDecoratorMeta.DATE_PROPERTY);
		const date  = dates?.find(f => f.property === field);

		return [date !== undefined, field, date];
	}

	public async createIndexes() {
		const indexes = this.getMeta<ModelIndex[]>(ModelDecoratorMeta.INDEX, []);

		if (!indexes.length) {
			return;
		}

		// Only create what is missing or changed: dropping and rebuilding every index on
		// every boot is slow on large collections and leaves them unindexed meanwhile
		const existing = new Map(
			(await this.collection().listIndexes().toArray()).map(index => [index.name, index])
		);
		const toCreate = [];

		for (const {name, index} of indexes) {
			const current = existing.get(name);

			if (!current) {
				toCreate.push({name, key : index});
				continue;
			}

			if (Model.indexKeyChanged(index, current)) {
				Log.info(`Index "${name}" on ${this.constructor.name} changed; recreating it.`);
				await this.collection().dropIndex(name);
				toCreate.push({name, key : index});
			}
		}

		if (!toCreate.length) {
			return;
		}

		try {
			await this.collection().createIndexes(toCreate as any);
		} catch (error) {
			// e.g. a unique index over duplicate data: the model's declared indexes can't be
			// honoured, so don't boot as if they were
			throw new Error(`Failed to create indexes for model ${this.constructor.name}: ${(error as Error).message}`, {cause : error});
		}
	}

	/**
	 * Does the declared index spec differ from the index that exists?
	 * Text indexes are stored as {_fts: 'text', _ftsx: 1} with the fields in `weights`.
	 */
	private static indexKeyChanged(spec: any, current: any): boolean {
		if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
			// string/array forms: can't compare reliably, keep the existing index
			return false;
		}

		const textFields = Object.keys(spec).filter(field => spec[field] === 'text');
		if (textFields.length) {
			const weights = Object.keys(current.weights ?? {}).sort();

			return current.key?._fts !== 'text' || JSON.stringify(weights) !== JSON.stringify(textFields.sort());
		}

		return JSON.stringify(spec) !== JSON.stringify(current.key);
	}

	getHooks(): ModelHooksMeta {
		return this.getMeta<ModelHooksMeta>(ModelDecoratorMeta.MODEL_HOOK);
	}

	async callHook(hook: ModelHook, model: this): Promise<this> {
		if (!this.hasHook(hook)) {
			return model;
		}

		return await this.getHook(hook).handler(model as any);
	}

	getHook(hook: ModelHook): ModelHookMetaData {
		const hooks = this.getHooks();

		return hooks[hook] ?? null;
	}

	hasHook(hook: ModelHook): boolean {
		const hooks = this.getHooks();

		if (!hooks) {
			return false;
		}

		return hooks[hook]?.type !== undefined;
	}

}

function getCollection<T extends Model<any>>(model: new() => T): Collection<T> {
	return resolve<Collection<T>>(this.name + 'ModelCollection');
}

