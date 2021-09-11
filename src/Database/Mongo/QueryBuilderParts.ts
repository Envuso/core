import {Filter, ObjectId} from "mongodb";
import {Obj} from "../../Common";
import {getModelObjectIds} from "../ModelDecorators";
import _ from 'lodash';
import {ModelRelationMeta} from "../ModelRelationshipDecorators";
import {ModelHelpers} from "./ModelHelpers";

export class QueryBuilderParts<T> {

	private objectIds: string[] = [];

	private query: object = {};
	private relationships: { [p: string]: ModelRelationMeta };

	constructor(model: T) {
		this.objectIds = Obj.pluck<string>(getModelObjectIds(model), 'name');
	}

	public add(key: any);
	public add(key: any, value: any);
	public add(key: any | object, value?: any) {
		if (typeof key !== 'string') {
			this.addToQuery(this.convertObjectValuesToObjectId(key));
			return;
		}

		if (ModelHelpers.keyContainsObjectId(key, this.objectIds)) {
			this.addToQuery(key, this.convertToObjectId(key, value));
			return;
		}

		if (_.isPlainObject(value)) {
			this.addToQuery(key, this.convertObjectValuesToObjectId(value));
			return;
		}

		this.addToQuery(key, value);
	}

	getObjectIds(): string[] {
		return this.objectIds;
	}


	private addToQuery(key: object);
	private addToQuery(key: string, value: any);
	private addToQuery(key: string | object, value?: any) {
		/**
		 * We can pass just an object to this method
		 * If we do, "key" will be that object, value will be undefined
		 */
		if (typeof key !== 'string') {
			this.query = _.merge(this.query, key);
			return;
		}


		if (this.isDotAccess(key)) {
			this.query = _.set(this.query, key, value);

			return;
		}

		this.query = _.merge(this.query, {[key] : value});
	}

	//	private keyContainsObjectId(key: string): boolean {
	//		/**
	//		 * We want to be able to do something like
	//		 *
	//		 * .add('user._id', 'sdkfjskldjfs');
	//		 *
	//		 * Which if the query was currently like {user: {someValue :true}}
	//		 * it would get appended to this user object
	//		 *
	//		 * We need to split the user._id string and check each part
	//		 */
	//		if (this.isDotAccess(key)) {
	//			return this.dotAccessContainsObjectIdKey<boolean>(key, true);
	//		}
	//
	//
	//		return this.objectIds.includes(key);
	//	}

	private convertObjectValuesToObjectId(objectValue: any) {
		for (let key in objectValue) {
			const value = objectValue[key];

			if (ModelHelpers.keyContainsObjectId(key, this.objectIds) && _.isString(value)) {
				if (!ObjectId.isValid(value)) {
					continue;
				}

				objectValue[key] = new ObjectId(value);
			}

			if (_.isPlainObject(value)) {
				objectValue[key] = this.convertObjectValuesToObjectId(objectValue[key]);
			}

		}

		return objectValue;
	}

	private convertToObjectId(key: string, value: any) {
		if (this.isDotAccess(key)) {
			const pathToObjectId = this.getDotAccessObjectIdPath(key);

			if (!ObjectId.isValid(value) && _.isString(value)) {
				return value;
			}

			switch (true) {
				case _.isPlainObject(value):
					//					let objectId = _.get(value, pathToObjectId);
					//					if (!ObjectId.isValid(objectId)) {
					//						return value;
					//					}
					//					return _.set(value, pathToObjectId, new ObjectId(_.get(value, pathToObjectId)));
					return this.convertObjectValuesToObjectId(value);

				case _.isString(value):
					if (!ObjectId.isValid(value)) {
						return value;
					}

					return new ObjectId(value);

				case _.isArray(value):
					value = value.map(v => {
						if (ObjectId.isValid(v)) {
							v = new ObjectId(v);
						}

						return v;
					});

			}
		}


		if (!ObjectId.isValid(value)) {
			return value;
		}

		return new ObjectId(value);
	}

	private isDotAccess(key: string) {
		return key.includes('.');
	}

	private dotAccessContainsObjectIdKey<T extends string>(key: string, returnBool?: boolean): string;
	private dotAccessContainsObjectIdKey<T extends boolean>(key: string, returnBool?: boolean): boolean;
	private dotAccessContainsObjectIdKey<T extends string | boolean>(key: string, returnBool: boolean = true): T {
		const parts = key.split('.');

		for (let part of parts) {
			if (this.objectIds.includes(part)) {
				return (returnBool ? true : part) as T;
			}
		}

		return (returnBool ? false : null) as T;
	}

	private getDotAccessObjectIdPath(key: string): string {
		const parts     = key.split('.');
		const partsPath = [];

		for (let part of parts) {
			partsPath.push(part);

			if (this.objectIds.includes(part)) {
				return partsPath.join('.');
			}
		}

		return null;
	}

	public getQuery(): any {
		return this.query;
	}

	getQueryAsFilter(): Filter<T> {
		return this.query;
	}

	public convertSingleQuery<R>(query: any): R {
		return this.convertObjectValuesToObjectId(query);
	}

	public removeRelationships<R>(query: any): R {
		const attributes          = this.convertObjectValuesToObjectId(query);
		const finalizedAttributes = {};

		for (let attributeKey in attributes) {
			if (this.relationships[attributeKey]) {
				continue;
			}

			finalizedAttributes[attributeKey] = attributes[attributeKey];
		}

		return finalizedAttributes as R;
	}

	public cleanup() {
		this.query = {};
	}

	public setRelationsData(modelRelationMetas: { [p: string]: ModelRelationMeta }) {
		this.relationships = modelRelationMetas;
	}
}
