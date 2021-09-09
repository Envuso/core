export * from './DatabaseServiceProvider';
export * from './Database';
export * from './Mongo/Model';
export * from './Mongo/QueryBuilder';
export * from './ModelDecorators';
export * from './ModelRelationshipDecorators';
export * from "./Serialization/Serializer";
export * from "../Redis/Redis";
export * from './Seeder/DatabaseSeeder';
export * from './Seeder/Seeder';
export * from './Seeder/SeedManager';

export declare type ClassType<T> = {
	new(...args: any[]): T;
};


type ModelPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type ModelPropertiesOnly<T> = {
	[P in ModelPropertyNames<T>]: T[P] extends object ? ModelProps<T[P]> : T[P]
};
export type ModelProps<T> = ModelPropertiesOnly<T>;
export type ArrayOfModelProps<T> = (keyof ModelProps<T>)[];
export type SingleModelProp<T> = keyof ModelProps<T>;

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


