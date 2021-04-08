import { Collection as MongoCollection, Cursor, FilterQuery, FindOneOptions, MongoClient, ObjectId, ReplaceOneOptions, WithoutProjection } from 'mongodb';
export declare type ClassType<T> = {
    new (...args: any[]): T;
};
export declare function dehydrate<T>(entity: T): Object;
export interface RepositoryOptions {
    /**
     * create indexes when creating repository. Will force `background` flag and not block other database operations.
     */
    autoIndex?: boolean;
    /**
     * database name passed to MongoClient.db
     *
     * overrides database name in connection string
     */
    databaseName?: string;
}
export declare class Repository<T> {
    protected Type: ClassType<T>;
    private readonly collection;
    /**
     * Underlying mongodb collection (use with caution)
     * any of methods from this will not return hydrated objects
     */
    get c(): MongoCollection;
    constructor(Type: ClassType<T>, mongo: MongoClient, collection: string, options?: RepositoryOptions);
    createIndexes(forceBackground?: boolean): Promise<any>;
    insert(entity: T): Promise<void>;
    update(entity: T, options?: ReplaceOneOptions): Promise<void>;
    save(entity: T): Promise<void>;
    findOne(query?: FilterQuery<T | {
        _id: any;
    }>): Promise<T | null>;
    findById(id: string | ObjectId): Promise<T | null>;
    findManyById(ids: string[] | ObjectId[]): Promise<T[]>;
    remove(entity: T): Promise<void>;
    /**
     * calls mongodb.find function and returns its cursor with attached map function that hydrates results
     * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    find(query?: FilterQuery<T | {
        _id: any;
    }>, options?: WithoutProjection<FindOneOptions<T>>): Cursor<T>;
    /**
     * Gets the number of documents matching the filter.
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
     * @returns integer
     * @param query
     */
    count(query?: FilterQuery<T>): Promise<number>;
    hydrate(plain: Object | null): T;
}
