import { QueryBuilder } from "@Providers/Model/QueryBuilder";
import { Repository } from "@Providers/Model/Repository";
import { ObjectId } from "mongodb";
export declare class ModelEntity<M> {
    /**
     * We'll store the result of the recent mongo request if there
     * is one. This way we always have access to it, and can return
     * generic true/false types of responses for some operations.
     */
    private _recentMongoResponse;
    private _queryBuilder;
    constructor();
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
    repository(): Repository<M>;
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
    refresh(): Promise<void>;
    /**
     * Delete the current model instance from the collection
     */
    delete(): Promise<void>;
    static count(): Promise<number>;
    /**
     * Get an instance of query builder, similar to using collection.find()
     * But... our query builder returns a couple of helper methods, first(), get()
     * {@see QueryBuilder}
     *
     * @param attributes
     */
    static where<T extends ModelEntity<T>>(attributes: Partial<T>): QueryBuilder<T>;
    static with<T>(...refs: (keyof T)[]): QueryBuilder<T>;
    /**
     * Find an item using it's id and return it as a model.
     *
     * @param id
     */
    static find<T extends ModelEntity<T>>(id: string | ObjectId): Promise<T>;
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
    static create<T extends ModelEntity<T>>(attributes: Partial<T>): Promise<T>;
    /**
     * Get an instance of the underlying mongo repository for this model
     */
    static query<T extends ModelEntity<T>>(): Repository<any>;
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
