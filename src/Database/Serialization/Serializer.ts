import {ObjectId} from 'mongodb';
import {Log} from "../../Common";
import {getModelObjectIds} from "../index";


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

		try {
			modelObjectIds[objectIdField.name] = new ObjectId(plain[objectIdField.name]);
		} catch (error) {
			console.error('Failed to create new object id for field: ' + objectIdField.name, error);
		}
	}

	return modelObjectIds;
}

