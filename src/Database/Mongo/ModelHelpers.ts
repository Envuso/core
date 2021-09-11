import {ObjectId} from "mongodb";
import {Classes} from "../../Common";
import {Obj} from "../../Common/Utility/Obj";
import {getModelObjectIds, ModelDecoratorMeta} from "../ModelDecorators";
import {Model} from "./Model";
import _ from 'lodash';

export class ModelHelpers {

	public static modelObjectIds: Map<string, string[]> = new Map();

	public static isDotAccess(key: string) {
		return key.includes('.');
	}

	public static keyContainsObjectId(key: string, objectIds: string[]): boolean {
		/**
		 * We want to be able to do something like
		 *
		 * .add('user._id', 'sdkfjskldjfs');
		 *
		 * Which if the query was currently like {user: {someValue :true}}
		 * it would get appended to this user object
		 *
		 * We need to split the user._id string and check each part
		 */
		if (this.isDotAccess(key)) {
			return this.dotAccessContainsObjectIdKey<boolean>(objectIds, key, true);
		}

		return objectIds.includes(key);
	}

	public static dotAccessContainsObjectIdKey<T extends string>(objectIds: string[], key: string, returnBool?: boolean): string;
	public static dotAccessContainsObjectIdKey<T extends boolean>(objectIds: string[], key: string, returnBool?: boolean): boolean;
	public static dotAccessContainsObjectIdKey<T extends string | boolean>(objectIds: string[], key: string, returnBool: boolean = true): T {
		const parts = key.split('.');

		for (let part of parts) {
			if (objectIds.includes(part)) {
				return (returnBool ? true : part) as T;
			}
		}

		return (returnBool ? false : null) as T;
	}

	public static convertObjectIdsInAttributes<T>(model: Model<T>, attributes: object, objectIdInformation?: string[]) {
		if (!objectIdInformation) {
			let meta = this.modelObjectIds.get(Classes.getConstructorName(model));
			if (!meta) {
				meta = Obj.pluck<string>(getModelObjectIds(model), 'name');
				this.modelObjectIds.set(Classes.getConstructorName(model), meta);
			}
			objectIdInformation = meta;
		}

		for (let key in attributes) {
			const value = attributes[key];

			if (this.keyContainsObjectId(key, objectIdInformation) && _.isString(value)) {
				if (!ObjectId.isValid(value)) {
					continue;
				}

				attributes[key] = new ObjectId(value);
			}

			if (_.isPlainObject(value)) {
				attributes[key] = this.convertObjectIdsInAttributes(model, attributes[key], objectIdInformation);
			}

		}

		return attributes;

	}

	public static removeRelationsFromAttributes<T>(model: Model<T>, attributes: object, relationsInformation) {

	}

	public static getMeta<T>(target: any, metaKey: ModelDecoratorMeta, _default: any = null): T {
		return (
			Reflect.getMetadata(
				metaKey,
				Classes.isInstantiated(target) ? target : target.constructor
			) ?? _default
		) as T;
	}

}
