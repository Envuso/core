import { Collection, FilterQuery, FindOneOptions, ObjectId, ReplaceOneOptions, UpdateQuery, WithoutProjection } from "mongodb";
import { Paginator } from "./Paginator";
import { QueryBuilder } from "./QueryBuilder";
export declare class Model<M> {
    /**
     * We'll store the result of the recent mongo request if there
     * is one. This way we always have access to it, and can return
     * generic true/false types of responses for some operations.
     */
    private _recentMongoResponse;
    private readonly _queryBuilder;
    constructor();
    /**
     * Access the underlying mongo collection for this model
     */
    collection(): Collection<M>;
    /**
     * Get an instance of the mongo repository
     */
    static getCollection<T extends Model<any>>(this: new () => T): Collection<T>;
    /**
     * Get the query builder instance
     */
    queryBuilder(): QueryBuilder<M>;
    /**
     * Get an instance of query builder, similar to using collection.find()
     * But... our query builder returns a couple of helper methods, first(), get()
     *
     * This method proxies right through to the query builder.
     *
     * {@see QueryBuilder}
     *
     * @param attributes
     */
    static where<T extends Model<any>>(this: new () => T, attributes: FilterQuery<T> | Partial<T>): QueryBuilder<T>;
    /**
     * Query for a single model instance
     *
     * @param query
     */
    static findOne<T extends Model<any>>(this: new () => T, query?: FilterQuery<T | {
        _id: any;
    }>): Promise<T | null>;
    /**
     * calls mongodb.find function and returns its cursor with attached map function that hydrates results
     * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    static get<T extends Model<any>>(this: new () => T, query?: FilterQuery<T | {
        _id: any;
    }>, options?: WithoutProjection<FindOneOptions<T>>): Promise<T[]>;
    /**
     * Count all the documents in the collection
     */
    static count(): Promise<number>;
    /**
     * Paginate all data on the collection
     */
    static paginate<T extends Model<any>>(this: new () => T, limit?: number): Promise<Paginator<T>>;
    /**
     * Allows us to efficiently load relationships
     * one to many
     *
     * @param refs
     */
    static with<T extends Model<any>>(this: new () => T, ...refs: (keyof T)[]): QueryBuilder<T>;
    /**
     * Find an item using it's id and return it as a model.
     *
     * @param key
     * @param field
     */
    static find<T extends Model<any>>(this: new () => T, key: string | ObjectId, field?: keyof T | '_id'): Promise<T>;
    /**
     * Basically an alias of the {@see QueryBuilder.orderByDesc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByDesc<T extends Model<any>>(this: new () => T, key: keyof T): QueryBuilder<T>;
    /**
     * Basically an alias of the {@see QueryBuilder.orderByAsc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByAsc<T extends Model<any>>(this: new () => T, key: keyof T): QueryBuilder<T>;
    /**
     * Sometimes we just want a simple way to check if
     * a document exists with the specified fields
     *
     * @param {FilterQuery<T>} query
     * @returns {Promise<boolean>}
     */
    static exists<T extends Model<any>>(this: new () => T, query: FilterQuery<T>): Promise<boolean>;
    /**
     * Create a new instance of this model and store it in the collection
     *
     * @param {Partial<M>} attributes
     */
    static create<T extends Model<any>>(this: new () => T, attributes: Partial<T>): Promise<T>;
    /**
     * Update this model
     *
     * @param attributes
     * @param options
     */
    update(attributes: UpdateQuery<M> | Partial<M>, options?: ReplaceOneOptions): Promise<M>;
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
    collectionName(many?: boolean): string;
    static formatNameForCollection(str: string, many?: boolean): string;
    /**
     * When this model instance is returned in a
     * response, we'll make sure to use classToPlain so
     * that any @Exclude() properties etc are taken care of.
     */
    toJSON(): Record<string, any>;
    getMongoAtomicOperators(): string[];
}
