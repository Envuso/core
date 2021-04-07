import {plainToClass} from 'class-transformer';
import {injectable} from "inversify";
import {
	Collection as MongoCollection,
	Cursor,
	FilterQuery, FindOneOptions,
	IndexSpecification,
	MongoClient,
	ObjectId,
	ReplaceOneOptions, WithoutProjection,
} from 'mongodb';

import {Ref} from '.';

export declare type ClassType<T> = {
	new(...args: any[]): T;
};

export function dehydrate<T>(entity: T, /*idField?: string*/): Object {
	// const plain = classToPlain(entity) as any;
	if (!entity)
		return entity;

	const refs = Reflect.getMetadata('mongo:refs', entity) || {};

	for (let name in refs) {
		const ref: Ref     = refs[name];
		const reffedEntity = entity[name];

		if (reffedEntity) {

			if (ref.array) {
				entity[ref._id] = reffedEntity.map(
					(e: any) => new ObjectId(e._id)
				);

				continue;
			}

			entity[ref._id] = new ObjectId(reffedEntity._id);
		}
	}

	const plain: any = Object.assign({}, entity);

	for (let name in refs) {
		delete plain[name];
	}


	const nested = Reflect.getMetadata('mongo:nested', entity) || [];
	for (let { name, array } of nested) {
		if (plain[name]) {
			if (!array) {
				plain[name] = dehydrate(plain[name]);
			} else {
				plain[name] = plain[name].map((e: any) => dehydrate(e));
			}
		}
	}

	const ignores = Reflect.getMetadata('mongo:ignore', entity) || {};
	for (const name in ignores) {
		delete plain[name];
	}

	return plain;
}

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

export class Repository<T> {

	private readonly collection: MongoCollection;

	/**
	 * Underlying mongodb collection (use with caution)
	 * any of methods from this will not return hydrated objects
	 */
	get c(): MongoCollection {
		return this.collection;
	}

	constructor(protected Type: ClassType<T>, mongo: MongoClient, collection: string, options: RepositoryOptions = {}) {
		this.collection = mongo.db(options.databaseName).collection(collection);

		if (options.autoIndex)
			this.createIndexes(true);
	}

	async createIndexes(forceBackground: boolean = false) {
		const indexes: IndexSpecification[] = Reflect.getMetadata('mongo:indexes', this.Type.prototype) || [];

		if (indexes.length == 0)
			return null;

		if (forceBackground) {
			for (let index of indexes) {
				index.background = true;
			}
		}

		return this.collection.createIndexes(indexes);
	}

	async insert(entity: T) {
		const plain = dehydrate<T>(entity);

		const res = await this.collection.insertOne(plain);

		(entity as any)._id = res.insertedId;
	}

	async update(entity: T, options: ReplaceOneOptions = {}) {
		const plain = dehydrate<T>(entity);
		await this.collection.replaceOne({
			_id : (entity as any)._id//(entity as any)[this.idField]
		}, plain, options);
	}

	async save(entity: T) {
		if (!(entity as any)._id)
			await this.insert(entity);
		else
			await this.update(entity);
	}

	async findOne(query: FilterQuery<T | { _id: any }> = {}): Promise<T | null> {
		return this.hydrate(await this.collection.findOne<Object>(query));
	}

	async findById(id: string | ObjectId): Promise<T | null> {
		return this.findOne({_id : new ObjectId(id)});
	}

	async findManyById(ids: string[] | ObjectId[]): Promise<T[]> {
		return this.find({
			_id : {$in : ids.map(id => new ObjectId(id))}
		}).toArray();
	}

	async remove(entity: T): Promise<void> {
		await this.c.deleteOne({_id : (entity as any)._id});
	}

	/**
	 * calls mongodb.find function and returns its cursor with attached map function that hydrates results
	 * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
	 */
	find(query?: FilterQuery<T | { _id: any }>, options?: WithoutProjection<FindOneOptions<T>>): Cursor<T> {
		return this.collection.find(query, options).map(doc => this.hydrate(doc) as T);
	}

	/**
	 * Gets the number of documents matching the filter.
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
	 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
	 * @returns integer
	 * @param query
	 */
	async count(query?: FilterQuery<T>) {
		return this.collection.countDocuments(query);
	}

	hydrate(plain: Object | null) {
		return plain ? plainToClass<T, Object>(this.Type, plain) : null;
	}
}
