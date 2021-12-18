import {Exclude} from "class-transformer";
import {DecoratorHelpers} from "../Common";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";

export enum InternalModelDecoratorMeta {
	INTERNALLY_EXCLUDED = 'envuso:model:internally-excluded-property',
}

/**
 * This will mark a property as excluded internally
 *
 * This is for cases where these properties should NOT be
 * included in any responses, persisted to the database
 * and are solely there just for internal functionality
 */
export function internalExclude() {
	return function (target: any, propertyKey: string) {
		DecoratorHelpers.addToMetadataObject(
			InternalModelDecoratorMeta.INTERNALLY_EXCLUDED,
			propertyKey,
			true,
			target
		);

		Exclude()(target, propertyKey);
	};
}

export function getInternallyExcluded(target: new () => ModelContract<any>) {
	return Reflect.getMetadata(InternalModelDecoratorMeta.INTERNALLY_EXCLUDED, target) || {}
}
