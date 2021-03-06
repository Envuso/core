import {instanceToPlain, plainToInstance, Transform} from "class-transformer";
import {DecoratorHelpers} from "../Common";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";
import {Database, ModelDecoratorMeta} from "./index";

export enum ModelRelationType {
	HAS_MANY        = 'has-many',
	HAS_ONE         = 'has-one',
	BELONGS_TO      = 'belongs-to',
	BELONGS_TO_MANY = 'belongs-to-many',
}

type RelationDecoratorProperties = {
	relatedModel: string;
	foreignKey: string;
	localKey: string;
	sort: RelationSortOption;
}

export interface ModelRelationMeta {
	// This is the property on the model that the relation
	// data will be applied to when loaded.
	propertyKey: string;
	relatedModel: string,
	foreignKey?: string;
	localKey?: string;
	isLocalKeyArray: boolean;
	type: ModelRelationType;
	sort: RelationSortOption;
}

export type RelationSortOption = { [key: string]: -1 | 1 };

function handleRelationshipTransforms(relatedModel: (new () => ModelContract<any>) | string, target: any, propertyKey: string) {
	// When serializing object to class, convert the object to our model instance
	Transform(({value}) => {
		if (!value) return null;
		return plainToInstance(Database.getModelFromContainer(relatedModel), value);
	}, {toClassOnly : true})(target, propertyKey);

	// When de-serializing from class to object, convert the model class to an object
	Transform(({value}) => {
		if (!value) return null;
		return instanceToPlain(value);
	}, {toPlainOnly : true})(target, propertyKey);
}

function relationshipTypeForMetaKey(decoratorType: ModelDecoratorMeta): ModelRelationType {
	switch (decoratorType) {
		case ModelDecoratorMeta.HAS_ONE_RELATION:
			return ModelRelationType.HAS_ONE;
		case ModelDecoratorMeta.HAS_MANY_RELATION:
			return ModelRelationType.HAS_MANY;
		case ModelDecoratorMeta.BELONGS_TO_RELATION:
			return ModelRelationType.BELONGS_TO;
		case ModelDecoratorMeta.BELONGS_TO_MANY_RELATION:
			return ModelRelationType.BELONGS_TO_MANY;
	}
}

/**
 * Removes some code duplication between the different relationship decorators
 *
 * @param {any[]} properties
 * @param {ModelDecoratorMeta} decoratorType
 * @param {RelationSortOption} sort
 *
 * @returns {(target: any, propertyKey: string) => void}
 */
function relationDecorator(
	properties: IArguments,
	decoratorType: ModelDecoratorMeta,
	sort: RelationSortOption
) {
	const decoratorProperties: RelationDecoratorProperties = {
		relatedModel : Database.getModelCollectionName(properties[0]),
		foreignKey   : properties[1],
		localKey     : properties[2],
		sort,
	};

	return function (target: any, propertyKey: string) {

		// If modelPropType is undefined.... it's probably because there's no decorator
		// and there's no elegant solution i can be fucked to figure out right now.
		// HF future sam

		let isLocalKeyArray = false;
		if (decoratorProperties.localKey.includes('.')) {
			const modelPropType = Reflect.getMetadata(
				'design:type',
				target,
				decoratorProperties.localKey.split('.')[0]
			);
			isLocalKeyArray     = (modelPropType === Array);
		}

		const relationMeta: ModelRelationMeta = {
			isLocalKeyArray,
			propertyKey,
			...decoratorProperties,
			type : relationshipTypeForMetaKey(decoratorType)
		};
		DecoratorHelpers.pushToMetadata(decoratorType, [relationMeta], target);
		handleRelationshipTransforms(decoratorProperties.relatedModel, target, propertyKey);
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
 * @param sort
 * @returns {(target: any, propertyKey: string) => void}
 */
export function hasOne(
	relatedModel: (new () => ModelContract<any>) | string,
	foreignKey: string,
	localKey: string,
	sort: RelationSortOption = {_id : 1}
) {
	return relationDecorator(arguments, ModelDecoratorMeta.HAS_ONE_RELATION, sort);
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
 * @param sort
 * @returns {(target: any, propertyKey: string) => void}
 */
export function hasMany(
	relatedModel: (new () => ModelContract<any>) | string,
	foreignKey: string,
	localKey: string,
	sort: RelationSortOption = {_id : 1}
) {
	return relationDecorator(arguments, ModelDecoratorMeta.HAS_MANY_RELATION, sort);
}

/**
 * Basically the inverse of hasOne
 *
 * @param {{new(): ModelContract<any>} | string} relatedModel
 * @param {string} localKey
 * @param {string} foreignKey
 * @param sort
 * @returns {(target: any, propertyKey: string) => void}
 */
export function belongsTo(
	relatedModel: (new () => ModelContract<any>) | string,
	localKey: string,
	foreignKey: string,
	sort: RelationSortOption = {_id : 1}
) {
	return relationDecorator(arguments, ModelDecoratorMeta.BELONGS_TO_RELATION, sort);
}

// Where is belongsToMany you ask?
// I don't have the brain power right now
