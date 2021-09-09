import {TypeOptions} from "class-transformer";
import {CollationDocument, FilterQuery} from "mongodb";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";

export * from './DatabaseServiceProvider';
export * from './Mongo/Model';
export * from './Mongo/QueryBuilder';
export * from './ModelDecorators';
//export * from './Exceptions/InvalidRefSpecified';
export * from './Serialization/Serializer';
export * from './Redis/Redis';

export * from './Seeder/DatabaseSeeder';
export * from './Seeder/Seeder';
export * from './Seeder/SeedManager';

export declare type ClassType<T> = {
	new(...args: any[]): T;
};

//(type?: TypeHelpOptions) => Function, options?: TypeOptions
export type TypeFunction = (type?: TypeOptions) => ClassType<any>;


type ModelPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type ModelPropertiesOnly<T> = {
	[P in ModelPropertyNames<T>]: T[P] extends object ? ModelProps<T[P]> : T[P]
};
export type ModelProps<T> = ModelPropertiesOnly<T>;
export type ArrayOfModelProps<T> = (keyof ModelProps<T>)[];
export type SingleModelProp<T> = keyof ModelProps<T>;

/**
 * Options passed to mongodb.createIndexes
 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#createIndexes and http://docs.mongodb.org/manual/reference/command/createIndexes/
 */
export interface IndexOptions<T> extends SimpleIndexOptions<T> {
	key: { [key in keyof T]?: number | string };
	name: string;
}

/**
 * This must be identical (with a few stricter fields) to IndexSpecification from mongodb, but without 'key' field.
 * It would be great it we could just extend that interface but without that field.
 *
 * Options passed to mongodb.createIndexes
 * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#createIndexes and http://docs.mongodb.org/manual/reference/command/createIndexes/
 */
export interface SimpleIndexOptions<T> {
	name?: string;
	background?: boolean;
	unique?: boolean;

	// stricter
	partialFilterExpression?: FilterQuery<T>;

	sparse?: boolean;
	expireAfterSeconds?: number;
	storageEngine?: object;

	// stricter
	weights?: { [key in keyof T]?: number };
	default_language?: string;
	language_override?: string;
	textIndexVersion?: number;
	"2dsphereIndexVersion"?: number;
	bits?: number;
	min?: number;
	max?: number;
	bucketSize?: number;
	collation?: CollationDocument;
}

export interface Nested {
	name: string;
	array: boolean;
}

export interface Ref {
	_id: string;
	array: boolean;
	modelName: string;
	aggregationLookupModelName: string;
	aggregationUnwindModelName: string;
}

export interface ModelObjectId {
	name: string;
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

export enum ModelRelationType {
	HAS_MANY        = 'has-many',
	HAS_ONE         = 'has-one',
	BELONGS_TO      = 'belongs-to',
	BELONGS_TO_MANY = 'belongs-to-many',
}

export interface ModelRelationMeta {
	// This is the property on the model that the relation
	// data will be applied to when loaded.
	propertyKey: string;
	relatedModel: ModelContract<any> | string,
	foreignKey?: string;
	localKey?: string;
	type: ModelRelationType;
}
