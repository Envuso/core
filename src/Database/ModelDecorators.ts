import {classToPlain, plainToClass, Transform} from "class-transformer";
import {ObjectId} from "mongodb";
import pluralize from "pluralize";
import {DecoratorHelpers} from "../Common";
import {ClassType, Model, ModelObjectId, Nested, Ref} from "./index";

export enum ModelDecoratorMeta {
	HAS_ONE_RELATION         = 'envuso:model:relation:has-one',
	HAS_MANY_RELATION        = 'envuso:model:relation:has-many',
	BELONGS_TO_RELATION      = 'envuso:model:relation:belongs-to',
	BELONGS_TO_MANY_RELATION = 'envuso:model:relation:belongs-to-many',
	MODEL_OBJECT_ID          = 'envuso:model-object-id',
	AUTHORIZATION_POLICY_REF = 'envuso:authorization-policy',
}

function addRef(name: string, ref: Ref, target: any) {
	const refs = Reflect.getMetadata('mongo:refs', target) || {};
	refs[name] = ref;
	Reflect.defineMetadata('mongo:refs', refs, target);
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

export function ignore(target: any, propertyKey: any) {
	const ignores        = Reflect.getMetadata('mongo:ignore', target) || {};
	ignores[propertyKey] = true;
	Reflect.defineMetadata('mongo:ignore', ignores, target);
}

export function ref(modelReference: ClassType<any>) {
	return function (target: any, propertyKey: string) {
		const targetType = Reflect.getMetadata('design:type', target, propertyKey);
		isNotPrimitive(targetType, propertyKey);

		const isArray = targetType === Array;
		const refId   = pluralize(pluralize(propertyKey, 1) + (isArray ? 'Ids' : 'Id'), isArray ? 2 : 1);

		Reflect.defineMetadata('design:type', (isArray ? Array : ObjectId), target, refId);

		const refInfo = {
			_id                        : refId,
			array                      : isArray,
			modelName                  : modelReference.name,
			aggregationLookupModelName : String(pluralize(modelReference.name, 2)).toLowerCase(),
			aggregationUnwindModelName : String(pluralize(modelReference.name, isArray ? 2 : 1)).toLowerCase(),
		};
		addRef(propertyKey, refInfo, target);

		Transform((val) => {
			if (!val.value) {
				return null;
			}

			if (targetType === Array) {
				return val.value.map(v => plainToClass(modelReference, v));
			}

			return plainToClass(modelReference, val.value);
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

	};
}

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

	Transform(({value}) => new ObjectId(value), {toClassOnly : true})(target, propertyKey);
	Transform(({value}) => value.toString(), {toPlainOnly : true})(target, propertyKey);
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

