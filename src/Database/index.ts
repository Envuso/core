import {IndexSpecification} from "mongodb";

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

export interface Nested {
	name: string;
	array: boolean;
}

export interface ModelObjectId {
	name: string;
}

export interface ModelIndex {
	name: string;
	index: { [key: string]: any };
}

export type ModelDateField = {
	type: Function,
	property: string;
	formatter?: string | ((date: Date) => any),
	toClass: (value: any) => any,
	toPlain: (value: any) => any,
}
