import {Config} from "@Config";
import {classToPlain} from "class-transformer";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import pluralize from 'pluralize';
import {QueryBuilder, Repository} from "@Core";
import Container from "../../Container";


//export function model<T extends ModelEntity<T>>(constructor: T) {
////	return class extends constructor {
////
////		static repository(): Repository<T> {
////			return Container.get<Repository<T>>(this.constructor);
////		}
////
////	};
//	Reflect.defineMetadata(METADATA.MODEL, {type : constructor}, constructor);
//
////	Object.defineProperty(constructor.constructor.prototype, 'where', (attributes : Partial<T>) => {
////		const meta = Reflect.getMetadata(METADATA.MODEL, this);
////
////		console.log(meta);
////	})
//
////	return function(descriptor : any) {
////
////	}
//}


@injectable()
export class ModelEntity<M> {

	/**
	 * We'll store the result of the recent mongo request if there
	 * is one. This way we always have access to it, and can return
	 * generic true/false types of responses for some operations.
	 */
	private _recentMongoResponse: any = null;

	private _queryBuilder: QueryBuilder<M>;

	constructor() {
		this._queryBuilder = new QueryBuilder<M>(this);
	}

	queryBuilder(): QueryBuilder<M> {
		return this._queryBuilder;
	}

	/**
	 * A helper method used to return a correct type...
	 * We're still getting used to generics.
	 *
	 * @private
	 */
	private modelInstance(): M {
		return this as unknown as M;
	}

	/**
	 * Get an instance of the mongo repository
	 */
	repository(): Repository<M> {
		return Container.get<Repository<M>>(this.constructor);
	}

	/**
	 * Save any changes made to the model
	 *
	 * For ex:
	 * const user = await User.find(123);
	 * user.name = 'Sam';
	 * await user.save()
	 *
	 * @return this
	 */
	async save() {
		await this.repository().save(
			this.modelInstance()
		);

		return this;
	}

	async refresh() {
		const newVersion = await this.repository().findById((this as any)._id);

		Object.assign(this, newVersion);
	}

	/**
	 * Delete the current model instance from the collection
	 */
	async delete() {
		await this.repository().remove(this.modelInstance());
	}

	public static async count() {
		return this.where({}).count();
	}

	/**
	 * Get an instance of query builder, similar to using collection.find()
	 * But... our query builder returns a couple of helper methods, first(), get()
	 * {@see QueryBuilder}
	 *
	 * @param attributes
	 */
	static where<T extends ModelEntity<T>>(attributes: Partial<T>): QueryBuilder<T> {
//		const builder = new QueryBuilder<T>(new this());
		const model = (new this() as unknown as T);

		return model.queryBuilder().where(attributes);
	}

	static with<T>(...refs: (keyof T)[]) {
		const model: ModelEntity<T> = (new this() as ModelEntity<T>);

		return model.queryBuilder().with(...refs);
	}

	/**
	 * Find an item using it's id and return it as a model.
	 *
	 * @param id
	 */
	static find<T extends ModelEntity<T>>(id: string | ObjectId): Promise<T> {
		const model = new this() as unknown as T;

//		const builder = new QueryBuilder<T>(model);

		return model.repository().findById(id);
//		return builder
//			.
//			.where<T>({_id : new ObjectId(id)})
//			.first();
	}

	/**
	 * Basically an alias of the {@see QueryBuilder.orderByDesc()}
	 * that allows us to order and call get() or first()
	 *
	 * @param key
	 */
	static orderByDesc<T>(key: keyof T): QueryBuilder<T> {
		return new QueryBuilder<T>(new this()).orderByDesc(key);
	}

	/**
	 * Basically an alias of the {@see QueryBuilder.orderByAsc()}
	 * that allows us to order and call get() or first()
	 *
	 * @param key
	 */
	static orderByAsc<T>(key: keyof T): QueryBuilder<T> {
		return new QueryBuilder<T>(new this()).orderByAsc(key);
	}

	/**
	 * Create a new instance of this model and store it in the collection
	 *
	 * @TODO: Need to figure a solution for using generics with static methods.
	 *
	 * @param {Partial<M>} attributes
	 */
	static async create<T extends ModelEntity<T>>(attributes: Partial<T>) : Promise<T> {
		await this.query().insert(attributes);

		return await this.find(attributes['_id']) ;
	}

	/**
	 * Get an instance of the underlying mongo repository for this model
	 */
	static query<T extends ModelEntity<T>>() {
		//@ts-ignore
		return Container.get<Repository<M>>(this);
	}

	public mongoResponse(): any {
		return this._recentMongoResponse;
	}

	public setMongoResponse(response: any): any {
		this._recentMongoResponse = response;
	}

	/**
	 * Will return a correctly formatted name for the underlying mongo collection
	 */
	public collectionName(many: boolean = false) {
		return ModelEntity.formatNameForCollection(this.constructor.name, many);
	}

	static formatNameForCollection(str: string, many: boolean = false) {
		return String(pluralize(str, many ? 2 : 1)).toLowerCase()
	}

	/**
	 * When this model instance is returned in a
	 * response, we'll make sure to use classToPlain so
	 * that any @Exclude() properties etc are taken care of.
	 */
	toJSON() {
		return classToPlain<M>(this.modelInstance(), Config.http.responseSerialization);
	}

}

