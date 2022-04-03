import _ from "lodash";
import {Classes} from "../../../Common";
import {ModelContractConstructor} from "../../../Contracts/Database/Mongo/ModelContract";
import {RelationSortOption} from "../../ModelRelationshipDecorators";
import {Model} from "../Model";

export type RelationOptions = {
	foreignKey?: string;
	localKey?: string;
}

export type RelationModelKeyValue = { key: string, value?: any }

export class BaseModelRelation<M extends Model<any>> {

	isLocalKeyArray: boolean;
	sort: RelationSortOption;

	foreign: RelationModelKeyValue = {key : null};
	local: RelationModelKeyValue   = {key : null};

	currentModel: new (...args: any[]) => Model<any> = null;
	relatedModel: ModelContractConstructor<any> = null;

	constructor(
		thisModel: Model<any>,
		relatedModel: ModelContractConstructor<any>,
		options: RelationOptions
	) {
		this.currentModel = Classes.getConstructor(thisModel);
		this.relatedModel = relatedModel;
		this.foreign     = {key : options.foreignKey};
		this.local       = {key : options.localKey, value : _.get(thisModel, options.localKey)};
	}

}
