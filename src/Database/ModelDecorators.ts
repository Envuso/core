import {classToPlain, Exclude, plainToClass, Transform} from "class-transformer";
import {ObjectId} from "mongodb";
import {Classes, DecoratorHelpers} from "../Common";
import {ClassType, Model, ModelObjectId, Nested} from "./index";

export enum ModelDecoratorMeta {
	HAS_ONE_RELATION         = 'envuso:model:relation:has-one',
	HAS_MANY_RELATION        = 'envuso:model:relation:has-many',
	BELONGS_TO_RELATION      = 'envuso:model:relation:belongs-to',
	BELONGS_TO_MANY_RELATION = 'envuso:model:relation:belongs-to-many',
	IGNORED_PROPERTY = 'envuso:model:fields:ignored',
	MODEL_OBJECT_ID          = 'envuso:model-object-id',
	AUTHORIZATION_POLICY_REF = 'envuso:authorization-policy',
}

function isNotPrimitive(targetType: ClassType<any>, propertyKey: string) {
	if (targetType === ObjectId || targetType === String || targetType === Number || targetType === Boolean) {
		throw new Error(`property '${propertyKey}' cannot have nested type '${targetType}'`);
	}
}


export function nested(typeFunction: any) {
	return function (target: any, propertyKey: string) {
		const targetType = Reflect.getMetadata('design:type', target, propertyKey);

		isNotPrimitive(targetType, propertyKey);

		Transform((val) => {
			if (!val.value) {
				return null;
			}

			if (targetType === Array) {
				return val.value.map(v => plainToClass(typeFunction, v));
			}

			return plainToClass(typeFunction, val.value);
		}, {toClassOnly : true})(target, propertyKey);

		Transform((val) => {
			if (!val.value) {
				return null;
			}
			if (targetType === Array) {
				return val.value.map(v => classToPlain(v));
			}

			return classToPlain(val.value);
		}, {toPlainOnly : true})(target, propertyKey);


		DecoratorHelpers.pushToMetadata('mongo:nested', [{name : propertyKey, typeFunction, array : targetType === Array} as Nested], target);
	};
}

/**
 * Mark a model property as ignored
 *
 * If this added to a property, that property will never be persisted to the database.
 *
 * @param target
 * @param propertyKey
 */
export function ignore(target: any, propertyKey: any) {
	DecoratorHelpers.addToMetadataObject(
		ModelDecoratorMeta.IGNORED_PROPERTY,
		propertyKey,
		true,
		target
	);
}

/**
 * Define a model property as an array of mongo object ids
 * When serializing;
 * - This will convert it from a string array, to ObjectId array
 * when de-serializing;
 * - This will convert it from an ObjectId array, to string array
 *
 * @param target
 * @param {string} propertyKey
 */
export function ids(target: any, propertyKey: string) {
	isNotPrimitive(target, propertyKey);

	DecoratorHelpers.pushToMetadata(ModelDecoratorMeta.MODEL_OBJECT_ID, [
		{name : propertyKey} as ModelObjectId
	], target);

	Transform((val) => {
		if (!val.value) {
			return null;
		}

		return val.value.map(v => new ObjectId(v));
	}, {toClassOnly : true})(target, propertyKey);

	Transform((val) => {
		if (!val.value) {
			return null;
		}

		return val.value.map(v => v.toString());
	}, {toPlainOnly : true})(target, propertyKey);

}

/**
 * Define a model property as a mongo object id
 * When serializing/de-serializing, this will convert it to/from a string
 *
 * @param target
 * @param {string} propertyKey
 */
export function id(target: any, propertyKey: string) {
	DecoratorHelpers.pushToMetadata(ModelDecoratorMeta.MODEL_OBJECT_ID, [
		{name : propertyKey} as ModelObjectId
	], target);

	Transform(({key, obj, value}) => {
		const objId = obj[key];

		if (objId instanceof ObjectId) {
			return objId;
		}

		return new ObjectId(objId);
	}, {toClassOnly : true})(target, propertyKey);

	Transform(({obj, key, value,}) => {
		const objId = obj[key];

		if (objId === undefined || typeof objId === 'string') {
			return objId;
		}

		return objId.toHexString();
	}, {toPlainOnly : true})(target, propertyKey);
}

/**
 * Define policy/gate logic for this model
 *
 * @see https://envuso.com/1.x/policies
 *
 * @param {ClassType<any>} policy
 * @returns {(constructor: Function) => void}
 */
export function policy(policy: ClassType<any>) {
	return function (constructor: Function) {
		Reflect.defineMetadata(ModelDecoratorMeta.AUTHORIZATION_POLICY_REF, policy, constructor);
		if (constructor.prototype.constructor.name !== 'Model') {
			Reflect.defineMetadata(ModelDecoratorMeta.AUTHORIZATION_POLICY_REF, policy, constructor.prototype);
		}
	};
}

export function getModelObjectIds<T>(target: any): ModelObjectId[] {
	return DecoratorHelpers.get<ModelObjectId[]>(
		!Classes.isInstantiated(target) ? new target() : target,
		ModelDecoratorMeta.MODEL_OBJECT_ID
	) || [];
}
