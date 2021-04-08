import { Expose, Transform, Type, TypeOptions } from "class-transformer";
import { CollationDocument, FilterQuery, IndexSpecification, ObjectId } from "mongodb";
import { ClassType } from "./repository";

//(type?: TypeHelpOptions) => Function, options?: TypeOptions
export type TypeFunction = (type?: TypeOptions) => ClassType<any>;

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
}