import {ObjectId} from "mongodb";

const HEX_OBJECT_ID = /^[a-f0-9]{24}$/i;

/**
 * Is this an ObjectId, or the 24 hex character form of one?
 *
 * Use instead of ObjectId.isValid(), which also accepts any 12 character string
 * ("hello world!") and numbers, so ordinary values got converted to ObjectIds.
 */
export function isObjectId(value: unknown): value is ObjectId | string {
	if (value instanceof ObjectId) {
		return true;
	}

	return typeof value === 'string' && HEX_OBJECT_ID.test(value);
}
