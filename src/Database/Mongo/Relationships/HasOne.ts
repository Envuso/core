import {ModelContractConstructor} from "../../../Contracts/Database/Mongo/ModelContract";
import {Database} from "../../Database";
import {Model} from "../Model";
import {BaseModelRelation} from "./BaseModelRelation";

export class HasOne<M extends Model<any>> extends BaseModelRelation<M> {

	public static create<R extends Model<any>>(
		thisModel: Model<any>,
		relatedModel: new() => R,
		localKey: string,
		foreignKey: string,
	): HasOne<R> {
		return new HasOne<R>(
			thisModel,
			Database.getModelFromContainer(relatedModel) as ModelContractConstructor<any>,
			{localKey, foreignKey}
		);
	}

	query() {
		return this.relatedModel.query<M>()
			.where({[this.foreign.key] : this.local.value})
			.limit(1);
	}

}
