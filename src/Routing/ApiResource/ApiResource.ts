import {ObjectId} from "mongodb";
import {Obj} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {Model} from "../../Database";
import {PaginatedResponse, PaginatedResponsePagination} from "../../Database/Mongo/Paginator";
import {Responsable} from "../Context/Response/Responsable";
import {RequestContext} from "../index";
import {MissingValue} from "./Values/MissingValue";
import {anyValue} from "./Values/Value";

export type ResourceType<T> = new (data: T, pagination?: PaginatedResponsePagination, resource?: ResourceType<T>) => ApiResource<T>;

export abstract class ApiResource<T> implements Responsable {

	constructor(
		data: T,
		pagination: PaginatedResponsePagination = null,
		private resource: ResourceType<T>       = null
	) {
		this.data       = data;
		this.pagination = pagination;
	}

	protected pagination: PaginatedResponsePagination = null;

	protected data: T = null;

	static from<T extends any>(this: ResourceType<T>, item: T) {
		return new this(item, null, this);
	}

	static collection<T extends any, TT extends PaginatedResponse<T>>(
		this: ResourceType<T>,
		items: TT | T[]
	) {
		if (!Array.isArray(items) && (items as any)?.pagination) {
			return new this(items.data as T, items.pagination, this);
		}

		return new this(items as T, null, this);
	}

	abstract transform(request: RequestContextContract): any;

	/**
	 * Transform the passed in data into an object
	 * which will be safe to return as a response
	 *
	 * We'll attempt to de-hydrate all models & object ids
	 *
	 * This method will take the result of transform() defined on the ApiResource
	 *
	 * @param data
	 * @returns {any}
	 * @private
	 */
	private transformData(data: any) {
		let result: any = Array.isArray(data) ? [] : {};

		if (Array.isArray(data) || Obj.isObject(data)) {
			for (let key in data) {
				if (data[key] instanceof MissingValue) {
					continue;
				}

				if (data[key] instanceof ObjectId) {
					result[key] = data[key].toString();
					continue;
				}

				if (data[key] instanceof ApiResource) {
					result[key] = (data[key] as ApiResource<any>).toResponse();
					continue;
				}

				if (data[key] instanceof Model) {
					data[key]   = data[key].dehydrate();
					result[key] = data[key];
					continue;
				}

				if (typeof data[key] === 'string') {
					result[key] = data[key];
					continue;
				}

				if (typeof data[key] === 'function') {
					const mergeData = this.transformData(data[key]());

					if (mergeData === undefined || (mergeData instanceof MissingValue)) {
						continue;
					}

					result = {...mergeData, ...result};
					continue;
				}

				if (Array.isArray(data[key]) || Obj.isObject(data[key])) {
					result[key] = this.transformData(data[key]);
					continue;
				}

				result[key] = data[key];
			}
		}

		return result;
	}

	/**
	 * If our data is a model, we can conditionally add a models relationship
	 * data to the transformed result; but only if the relationship is loaded/exists
	 *
	 * @param {string} relation
	 * @param value
	 * @param _default
	 * @returns {any}
	 * @protected
	 */
	protected whenLoaded(relation: string, value: any = null, _default: any = undefined): any {
		if (_default === undefined) {
			_default = new MissingValue();
		}

		if (!(this.data instanceof Model)) {
			return anyValue(_default);
		}

		if (!this.data.relationIsLoaded(relation)) {
			return anyValue(_default);
		}


		if (value?.prototype instanceof ApiResource) {
			return Array.isArray(this.data[relation])
				? (value as any).collection(this.data[relation])
				: (value as any).from(this.data[relation]);
		}

		if (typeof value === 'function') {
			return value(this.data[relation]);
		}

		return this.data[relation];
	}

	protected merge(condition: boolean, data: any, _default: any = undefined) {
		if (!condition) {
			return _default !== undefined ? anyValue(_default) : new MissingValue();
		}

		return data;
	}

	/**
	 * Add a value to the transformed result if condition === true
	 * If it doesn't and a default value isn't specified, the key & value
	 * will be removed from the transformed result
	 *
	 * @param {boolean} condition
	 * @param cb
	 * @param _default
	 * @returns {any}
	 * @protected
	 */
	protected when(condition: boolean, cb: any, _default: any = undefined) {
		if (condition) {
			return anyValue(cb);
		}

		return _default !== undefined ? anyValue(_default) : new MissingValue();
	}

	toResponse() {

		if (Array.isArray(this.data)) {
			const context = RequestContext.get();

			const data = this.data.map(d => {
				return new this.resource(d, null, this.resource).transform(context);
			});

			if (this.pagination === null) {
				return this.transformData(data);
			}

			return this.transformData({
				data       : data,
				pagination : this.pagination,
			});
		}

		return this.transformData(this.transform(RequestContext.get()));
	}
}

