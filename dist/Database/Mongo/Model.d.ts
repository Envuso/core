import { Collection, FilterQuery, FindOneOptions, ObjectId, ReplaceOneOptions, WithoutProjection } from "mongodb";
import { QueryBuilder } from "./QueryBuilder";
export declare class Model<M> {
    /**
     * We'll store the result of the recent mongo request if there
     * is one. This way we always have access to it, and can return
     * generic true/false types of responses for some operations.
     */
    private _recentMongoResponse;
    private _queryBuilder;
    constructor();
    /**
     * Access the underlying mongo collection for this model
     */
    collection(): Collection<M>;
    /**
     * Get the query builder instance
     */
    queryBuilder(): QueryBuilder<M>;
    /**
     * A helper method used to return a correct type...
     * We're still getting used to generics.
     *
     * @private
     */
    private modelInstance;
    /**
     * Get an instance of the mongo repository
     */
    static getCollection<T extends Model<T>>(): Collection<T>;
    /**
     * Insert a new model into the collection
     *
     * @param entity
     */
    static insert(entity: Model<any>): Promise<Model<any>>;
    /**
     * Update this model
     *
     * @param attributes
     * @param options
     */
    update(attributes: Partial<M>, options?: ReplaceOneOptions): Promise<void>;
    /**
     * Query for a single model instance
     *
     * @param query
     */
    static findOne<T extends Model<T>>(query?: FilterQuery<T | {
        _id: any;
    }>): Promise<T | null>;
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
     * Get all the properties from the database for this model
     */
    refresh(): Promise<void>;
    /**
     * Delete the current model instance from the collection
     */
    delete(): Promise<void>;
    /**
     * calls mongodb.find function and returns its cursor with attached map function that hydrates results
     * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    static get<T extends Model<T>>(query?: FilterQuery<T | {
        _id: any;
    }>, options?: WithoutProjection<FindOneOptions<T>>): Promise<T[]>;
    /**
     * Count all the documents in the collection
     */
    static count(): Promise<number>;
    /**
     * Get an instance of query builder, similar to using collection.find()
     * But... our query builder returns a couple of helper methods, first(), get()
     * {@see QueryBuilder}
     *
     * @param attributes
     */
    static where<T extends Model<T>>(attributes: Partial<T>): QueryBuilder<T>;
    /**
     * Allows us to efficiently load relationships
     * Many to many or one to many
     *
     * @param refs
     */
    static with<T>(...refs: (keyof T)[]): QueryBuilder<T>;
    /**
     * Find an item using it's id and return it as a model.
     *
     * @param id
     */
    static find<T extends Model<T>>(id: string | ObjectId): Promise<T>;
    /**
     * Basically an alias of the {@see QueryBuilder.orderByDesc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByDesc<T>(key: keyof T): QueryBuilder<T>;
    /**
     * Basically an alias of the {@see QueryBuilder.orderByAsc()}
     * that allows us to order and call get() or first()
     *
     * @param key
     */
    static orderByAsc<T>(key: keyof T): QueryBuilder<T>;
    /**
     * Create a new instance of this model and store it in the collection
     *
     * @TODO: Need to figure a solution for using generics with static methods.
     *
     * @param {Partial<M>} attributes
     */
    static create<T extends Model<T>>(attributes: Partial<T>): Promise<T>;
    /**
     * Get an instance of the underlying mongo repository for this model
     */
    static query<T extends Model<T>>(): import("winston").Logger;
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
}
