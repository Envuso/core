import {Filter, UpdateFilter} from "mongodb";

export type ModelAttributesFilter<T> = Filter<T> | Partial<T | { _id: any }>

export type ModelAttributesUpdateFilter<T> = UpdateFilter<T> |  Partial<T | { _id: any }>;

type ModelPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type ModelPropertiesOnly<T> = {
	[P in ModelPropertyNames<T>]: T[P] extends object ? ModelProps<T[P]> : T[P]
};
export type ModelProps<T> = ModelPropertiesOnly<T>;
export type ArrayOfModelProps<T> = (keyof ModelProps<T>)[];
export type SingleModelProp<T> = keyof ModelProps<T>;
