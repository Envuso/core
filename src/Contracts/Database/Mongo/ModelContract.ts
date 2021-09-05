import {Collection, FilterQuery, FindOneOptions, ObjectId, ReplaceOneOptions, UpdateQuery, WithoutProjection} from "mongodb";
import {QueryBuilder} from "../../../Database";
import {PaginatorContract} from "./PaginatorContract";
import {QueryBuilderContract} from "./QueryBuilderContract";

export interface ModelContractConstructor<M> {
	new(): ModelContract<M>;

	where<T extends ModelContract<any>>(
		this: new() => T,
		attributes: FilterQuery<T> | Partial<T>
	): QueryBuilderContract<T>

	query<T extends ModelContract<any>>(
		this: new() => T,
	): QueryBuilderContract<T>

	when<T extends ModelContract<any>>(
		this: new() => T,
		condition: boolean | (() => boolean),
		attributes: FilterQuery<T> | Partial<T>
	): QueryBuilderContract<T>

	findOne<T extends ModelContract<any>>(
		this: new() => T,
		query: FilterQuery<T | { _id: any }>
	): Promise<T | null>

	get<T extends ModelContract<any>>(
		this: new() => T,
		query?: FilterQuery<T | { _id: any }>,
		options?: WithoutProjection<FindOneOptions<T>>
	): Promise<T[]>

	count(): Promise<number>

	paginate<T extends ModelContract<any>>(
		this: new() => T,
		limit: number
	): Promise<PaginatorContract<T>>

	with<T extends ModelContract<any>>(
		this: new() => T,
		...refs: (keyof T)[]
	): QueryBuilderContract<T>

	find<T extends ModelContract<any>>(
		this: new() => T,
		key: string | ObjectId,
		field?: keyof T | '_id'
	): Promise<T>

	orderByDesc<T extends ModelContract<any>>(
		this: new() => T,
		key: keyof T
	): QueryBuilderContract<T>

	orderByAsc<T extends ModelContract<any>>(
		this: new() => T,
		key: keyof T
	): QueryBuilderContract<T>

	exists<T extends ModelContract<any>>(
		this: new() => T,
		query: FilterQuery<T>
	)

	create<T extends ModelContract<any>>(
		this: new() => T,
		attributes: Partial<T>
	): Promise<T>
}

export interface ModelContract<M> {
	_recentMongoResponse: any;
	_queryBuilder: QueryBuilder<M>;

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
	update(
		attributes: UpdateQuery<M> | Partial<M>,
		options: ReplaceOneOptions
	): Promise<M>;

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

	mongoResponse(): any;

	setMongoResponse(response: any): any;

	/**
	 * Will return a correctly formatted name for the underlying mongo collection
	 */
	collectionName(many: boolean): string;

	/**
	 * When this model instance is returned in a
	 * response, we'll make sure to use classToPlain so
	 * that any @Exclude() properties etc are taken care of.
	 */
	toJSON(): Record<string, any>;

	getMongoAtomicOperators(): string[];
}
