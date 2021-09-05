import {classToPlain, plainToClass} from "class-transformer";
import {ObjectId} from 'mongodb';
import {Log} from "../../Common";
import {ClassType, ModelObjectId, Ref} from "../index";

export function dehydrateModel<T>(entity: T): Object {
	if (!entity)
		return entity;

	const refs = Reflect.getMetadata('mongo:refs', entity) || {};

	for (let name in refs) {
		const ref: Ref     = refs[name];
		const reffedEntity = entity[name];

		if (!reffedEntity) {
			continue;
		}

		if (ref.array) {
			entity[ref._id] = reffedEntity.map(
				(e: any) => new ObjectId(e._id)
			);

			continue;
		}

		entity[ref._id] = new ObjectId(reffedEntity._id);
	}

	const plain: any = classToPlain(entity, {
		enableCircularCheck : true,
		excludePrefixes     : ['_'],
		ignoreDecorators    : true
	});
	//	const plain: any = Object.assign({}, entity);

	for (let name in refs) {
		delete plain[name];
	}

	const nested = Reflect.getMetadata('mongo:nested', entity) || [];
	for (let {name, array} of nested) {
		if (plain[name]) {
			if (!array) {
				plain[name] = dehydrateModel(plain[name]);
			} else {
				plain[name] = plain[name].map((e: any) => dehydrateModel(e));
			}
		}
	}

	const ignores = Reflect.getMetadata('mongo:ignore', entity) || {};
	for (const name in ignores) {
		delete plain[name];
	}

	const modelObjectIds = convertEntityObjectIds(entity, plain);
	for (let modelObjectIdsKey in modelObjectIds) {
		plain[modelObjectIdsKey] = modelObjectIds[modelObjectIdsKey];
	}

	return plain;
}

export function hydrateModel<T>(plain: Object | null, type: ClassType<T>) {
	return plain ? plainToClass<T, Object>(type, plain, {
		ignoreDecorators : true,
	}) : null;
}

export function convertEntityObjectIds<T>(entity: T, plain: any): Object {
	const objectIds = getModelObjectIds(entity);

	const modelObjectIds: { [key: string]: string | ObjectId } = {};

	for (let objectIdField of objectIds) {
		if (!plain[objectIdField.name]) {
			continue;
		}
		if (plain[objectIdField.name] instanceof ObjectId) {
			modelObjectIds[objectIdField.name] = plain[objectIdField.name];
			continue;
		}
		if (!ObjectId.isValid(plain[objectIdField.name])) {
			Log.warn('Field ' + objectIdField.name + ' is being converted to an ObjectID... but ' + plain[objectIdField.name] + ' is not able to be converted to an ObjectID.');
			continue;
		}

		modelObjectIds[objectIdField.name] = new ObjectId(plain[objectIdField.name]);
	}

	return modelObjectIds;
}

export function getModelObjectIds(entity: any): ModelObjectId[] {
	return Reflect.getMetadata('mongo:objectId', entity) || [];
}
