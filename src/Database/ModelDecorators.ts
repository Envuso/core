import {classToPlain, plainToClass, Transform} from "class-transformer";
import {ObjectId} from "mongodb";
import pluralize from "pluralize";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";
import {ClassType, Model, ModelObjectId, ModelRelationMeta, ModelRelationType, Nested, Ref} from "./index";
import {getModelFromContainer} from "./ModelHelpers";

export enum ModelDecoratorMeta {
	HAS_ONE_RELATION         = 'envuso:model:relation:has-one',
	HAS_MANY_RELATION        = 'envuso:model:relation:has-many',
	MODEL_OBJECT_ID          = 'envuso:model-object-id',
	AUTHORIZATION_POLICY_REF = 'envuso:authorization-policy',
}

function addRef(name: string, ref: Ref, target: any) {
	const refs = Reflect.getMetadata('mongo:refs', target) || {};
	refs[name] = ref;
	Reflect.defineMetadata('mongo:refs', refs, target);
}

function pushToMetadata(metadataKey: string, values: any[], target: any) {
	const data: any[] = Reflect.getMetadata(metadataKey, target) || [];
	Reflect.defineMetadata(metadataKey, data.concat(values), target);
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

		//		Type(() => typeFunction)(target, propertyKey);

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


		pushToMetadata('mongo:nested', [{name : propertyKey, typeFunction, array : targetType === Array} as Nested], target);
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

	pushToMetadata(ModelDecoratorMeta.MODEL_OBJECT_ID, [
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
	pushToMetadata(ModelDecoratorMeta.MODEL_OBJECT_ID, [
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

/**
 * If we're defining a relation on our user model. For example... A user has an address.
 *
 * We'd have our user collection, "users" and addresses, "addresses"
 *
 * Our foreign key would be the user's id on our addresses collection, imagine the document:
 * {id: 1, address : "magic road", userId: 42}
 *
 * Now imagine our user document:
 * {id: 42, name: "Bruce"}
 *
 * This links our address to the user, via the address
 * userId key, to the user document via the id key
 *
 * In this case, userId is our "foreignKey" on addresses and
 * localKey is our "id" on users.
 *
 * @param {ModelContract<any> | string} relatedModel
 * @param {string} foreignKey
 * @param {string} localKey
 * @returns {(target: any, propertyKey: string) => void}
 */
export function hasOne(relatedModel: (new () => ModelContract<any>) | string, foreignKey: string, localKey: string) {
	return function (target: any, propertyKey: string) {
		pushToMetadata(ModelDecoratorMeta.HAS_ONE_RELATION, [
			{
				propertyKey,
				relatedModel,
				foreignKey,
				localKey,
				type : ModelRelationType.HAS_ONE
			} as ModelRelationMeta
		], target);


		// When serializing object to class, convert the object to our model instance
		Transform(({value}) => {
			if (!value) return null;
			return plainToClass(getModelFromContainer(relatedModel), value);
		}, {toClassOnly : true})(target, propertyKey);

		// When de-serializing from class to object, convert the model class to an object
		Transform(({value}) => {
			if (!value) return null;
			return classToPlain(value);
		}, {toPlainOnly : true})(target, propertyKey);
	};
}

/**
 *
 * If we're defining a relation on our user model. For example... A user has multiple addresses.
 *
 * We'd have our user collection, "users" and addresses, "addresses"
 *
 * Our foreign key would be the user's id on our addresses collection, imagine the documents:
 * {id: 1, address : "magic road", userId: 42}
 * {id: 2, address : "another magic road", userId: 42}
 *
 * Now imagine our user document:
 * {id: 42, name: "Bruce"}
 *
 * This links our address to the user, via the address
 * userId key, to the user document via the id key
 *
 * With hasMany we'd now return all of the address documents that have the userId of 42
 *
 * In this case, userId is our "foreignKey" on addresses and
 * localKey is our "id" on users.
 *
 * @param {{new(): ModelContract<any>} | string} relatedModel
 * @param {string} foreignKey
 * @param {string} localKey
 * @returns {(target: any, propertyKey: string) => void}
 */
export function hasMany(relatedModel: (new () => ModelContract<any>) | string, foreignKey: string, localKey: string) {
	return function (target: any, propertyKey: string) {
		pushToMetadata(ModelDecoratorMeta.HAS_MANY_RELATION, [
			{
				propertyKey,
				relatedModel,
				foreignKey,
				localKey,
				type : ModelRelationType.HAS_MANY
			} as ModelRelationMeta
		], target);


		// When serializing objects to classes, convert the object to our model instances
		Transform(({value}) => {
			if (!value) return null;
			return plainToClass(getModelFromContainer(relatedModel), value);
		}, {toClassOnly : true})(target, propertyKey);

		// When de-serializing from classes to objects, convert the model classes to an objects
		Transform(({value}) => {
			if (!value) return null;
			return classToPlain(value);
		}, {toPlainOnly : true})(target, propertyKey);
	};
}

