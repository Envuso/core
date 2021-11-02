import {ObjectId} from 'mongodb';
import {getModelObjectIds, transformToObjectIds} from "../index";


export function convertEntityObjectIds<T>(entity: T, plain: any): Object {
	const objectIds = getModelObjectIds(entity);

	const modelObjectIds: { [key: string]: (string | ObjectId) | (string[] | ObjectId[]) } = {};

	for (let objectIdField of objectIds) {
		if (!plain[objectIdField.name]) {
			continue;
		}

		modelObjectIds[objectIdField.name] = transformToObjectIds(plain[objectIdField.name]);
	}

	return modelObjectIds;
}

