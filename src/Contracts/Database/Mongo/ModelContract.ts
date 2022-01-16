import {
	Collection, Filter, FindOptions,
	ObjectId, OptionalId, UpdateOptions, UpdateResult,
} from "mongodb";
import {Model, ModelDateField, ModelDecoratorMeta, QueryBuilder} from "../../../Database";
import {ModelHook, ModelHookMetaData, ModelHooksMeta} from "../../../Database/ModelHooks";
import {ModelAttributesFilter, SingleModelProp} from "../../../Database/QueryBuilderTypes";
import {PaginatorContract} from "./PaginatorContract";
import {QueryBuilderContract} from "./QueryBuilderContract";

export interface ModelContractConstructor<M> {
	new(): M;

	getCollection<T extends Model<any>>(this: new() => T): Collection<T>;

	hydrate<T extends ModelContract<any>>(this: new() => T, attributes: Partial<T>);

	where<T extends ModelContract<any>>(this: new() => T, attributes: ModelAttributesFilter<T>): QueryBuilderContract<T>;

	query<T extends ModelContract<any>>(this: new() => T): QueryBuilderContract<T>;

	when<T extends Model<any>>(this: new() => T, condition: boolean | (() => boolean), attributes: ModelAttributesFilter<T>): QueryBuilderContract<T>;

	findOne<T extends Model<any>>(this: new() => T, query: Filter<T | { _id: any }>): Promise<T | null>;

	get<T extends Model<any>>(this: new() => T, query?: ModelAttributesFilter<T | { _id: any }>, options?: FindOptions<T>): Promise<T[]>;

	count(): Promise<number>;

	with<T extends Model<any>>(this: new() => T, ...refs: (keyof T)[]): QueryBuilderContract<T>;

	find<T extends Model<any>>(this: new() => T, key: string | ObjectId, field?: keyof T | '_id'): Promise<T>;

	create<T extends ModelContractConstructor<any>>(this: new() => T, attributes: Partial<T>): Promise<T>;

	insertMany<T extends Model<any>>(this: new() => T, models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }>;

	createMany<T extends Model<any>>(this: new() => T, models: T[] | Partial<T>[]): Promise<{ success: boolean, ids: ObjectId[] }>;

	hydrate<T extends Model<any>>(this: new() => T, attributes: Partial<T>);

	dehydrate<T extends Model<any>>(this: new() => T, model: T): object;
}

export interface ModelContract<M> {

	//_queryBuilder: QueryBuilder<M>;

	/**
	 * Access the underlying mongo collection for this model
	 */
	collection(): Collection<M>;

	/**
	 * Get the query builder instance
	 */
	queryBuilder(): QueryBuilderContract<M>;

	/**
	 * Update this model
	 *
	 * @param attributes
	 * @param options
	 */
	update(attributes: ModelAttributesFilter<M> | Partial<M>, options?: UpdateOptions & { returnMongoResponse: boolean }): Promise<boolean | UpdateResult>;

	assignAttributes(attributes: Partial<M>, ignoreFieldChecks?: boolean): void;

	/**
	 * Check if a relationship is loaded.
	 * This can be slightly inaccurate also... if we load a relationship
	 * but there isn't a relation to actually load(ie, a user with a book, but it doesnt have a book stored)
	 * then the value of the relationship on the model will be null.
	 *
	 * @param {SingleModelProp<M>} relationship
	 * @returns {boolean}
	 */
	relationIsLoaded(relationship: SingleModelProp<M>): boolean;

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
	save(): Promise<this>;

	/**
	 * Has this model been persisted to the database yet?
	 * @returns {boolean}
	 */
	isFresh(): boolean;

	/**
	 * Get the current models id
	 *
	 * @returns {ObjectId}
	 */
	getModelId(): ObjectId;

	/**
	 * Get all the properties from the database for this model
	 */
	refresh(): Promise<this>;

	/**
	 * Delete the current model instance from the collection
	 */
	delete(): Promise<boolean>;

	/**
	 * Will return a correctly formatted name for the underlying mongo collection
	 */
	collectionName(many: boolean): string;

	getAttributes(): Partial<M>;

	isAttribute(key: SingleModelProp<M> | string): boolean;

	hydrate(attributes: Partial<M>): M;

	dehydrateForQuery(): OptionalId<M>;

	dehydrate(): object;

	toBSON();

	/**
	 * When this model instance is returned in a
	 * response, we'll make sure to use classToPlain so
	 * that any @Exclude() properties etc are taken care of.
	 */
	toJSON(): Record<string, any>;

	/**
	 * Make it a tad cleaner to get meta from this model
	 *
	 * @template T
	 * @param {ModelDecoratorMeta} metaKey
	 * @param _default
	 * @returns {T}
	 */
	getMeta<T>(metaKey: ModelDecoratorMeta, _default?: any): T;

	getModelFields(): string[];

	isDateField(field: string): [boolean, string, (ModelDateField | undefined)];

	createIndexes(): Promise<void>;

	getHooks(): ModelHooksMeta;

	callHook(hook: ModelHook, model: this): Promise<this>;

	getHook(hook: ModelHook): ModelHookMetaData;

	hasHook(hook: ModelHook): boolean;
}
