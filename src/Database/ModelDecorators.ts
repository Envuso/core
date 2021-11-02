import {classToPlain, plainToClass, Transform} from "class-transformer";
import {IndexSpecification, ObjectId} from "mongodb";
import {Log, Classes, DecoratorHelpers, Obj} from "../Common";
import {ClassType, Model, ModelObjectId, Nested} from "./index";

export enum ModelDecoratorMeta {
	HAS_ONE_RELATION         = 'envuso:model:relation:has-one',
	HAS_MANY_RELATION        = 'envuso:model:relation:has-many',
	BELONGS_TO_RELATION      = 'envuso:model:relation:belongs-to',
	BELONGS_TO_MANY_RELATION = 'envuso:model:relation:belongs-to-many',
	IGNORED_PROPERTY         = 'envuso:model:fields:ignored',
	INDEX                    = 'envuso:model:index',
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
		return transformToObjectIds(obj[key]);
	}, {toClassOnly : true})(target, propertyKey);

	Transform(({obj, key, value,}) => {
		return transformFromObjectIds(obj[key]);
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

/**
 * Specify that this model needs to create indexes on mongodb
 *
 * @param {string} name
 * @param {IndexSpecification} indexSpec
 * @returns {(constructor: Function) => void}
 */
export function index(name: string, indexSpec: IndexSpecification) {
	return function (constructor: Function) {
		DecoratorHelpers.pushToMetadata(
			ModelDecoratorMeta.INDEX, [{name, index : indexSpec}], constructor.prototype
		);
	};
}

export function getModelObjectIds<T>(target: any): ModelObjectId[] {
	return DecoratorHelpers.get<ModelObjectId[]>(
		!Classes.isInstantiated(target) ? new target() : target,
		ModelDecoratorMeta.MODEL_OBJECT_ID
	) || [];
}

/**
 * Attempt to transform any type of object id definition from string -> object id
 * This will hopefully convert an object id string, object containing object id strings,
 * array of object id strings to object id instances.
 *
 * @param value
 * @returns {any}
 */
export function transformToObjectIds(value: any) {

	if (typeof value === 'string' && ObjectId.isValid(value)) {
		return new ObjectId(value);
	}

	for (let key in value) {
		const val = value[key];

		if (!val) {
			if (!ObjectId.isValid(val)) {
				Log.warn('Field ' + key + ' is being converted to an ObjectID... but ' + val + ' is not able to be converted to an ObjectID.');
				Log.warn('Full value: ', value);
			}
			continue;
		}

		if (val instanceof ObjectId) {
			value[key] = val;
			continue;
		}

		if (typeof val === 'string' && ObjectId.isValid(val)) {
			value[key] = new ObjectId(val);
		} else if (Array.isArray(val) || Obj.isObject(val)) {
			value[key] = transformToObjectIds(val);
		}
	}

	return value;
}

/**
 * This will attempt to transform an Object Id instance to a string, whether it's a single value
 * object containing one/many or an array of object ids
 *
 * @param value
 * @returns {any}
 */
export function transformFromObjectIds(value: any) {
	if (value instanceof ObjectId && ObjectId.isValid(value)) {
		return value.toHexString();
	}

	for (let key in value) {
		const val = value[key];

		if (!val) {
			continue;
		}

		if (val instanceof ObjectId) {
			value[key] = val.toHexString();
		} else if (Array.isArray(val) || Obj.isObject(val)) {
			value[key] = transformFromObjectIds(val);
		}
	}

	return value;
}
