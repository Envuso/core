import {ObjectId} from "mongodb";
import {Obj} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {Model, ModelDateField} from "../../Database";
import {PaginatedResponse, PaginatedResponsePagination} from "../../Database/Mongo/Paginator";
import {Responsable} from "../Context/Response/Responsable";
import {RequestContext} from "../index";
import {MissingValue} from "./Values/MissingValue";
import {anyValue} from "./Values/Value";

export type ResourceType<T> = new (
	data: T,
	pagination?: PaginatedResponsePagination,
	resource?: ResourceType<T>,
	...additionalArgs: any[]
) => ApiResource<T>;

export abstract class ApiResource<T> implements Responsable {

	constructor(
		data: T,
		pagination: PaginatedResponsePagination = null,
		resource: ResourceType<T>               = null,
		...additionalArgs: any[]
	) {
		this.data           = data;
		this.pagination     = pagination;
		this.additionalArgs = additionalArgs;
		this.resource       = resource;
	}

	private resource: ResourceType<T> = null;

	private additionalArgs: any[] = [];

	protected pagination: PaginatedResponsePagination = null;

	protected data: T = null;

	static from<T extends any>(this: ResourceType<T>, item: T, ...additionalArgs: any) {
		return new this(item, null, this, ...additionalArgs);
	}

	static collection<T extends any, TT extends PaginatedResponse<T>>(
		this: ResourceType<T>,
		items: TT | T[],
		...additionalArgs: any[]
	) {
		if (!Array.isArray(items) && (items as any)?.pagination) {
			return new this(items.data as T, items.pagination, this, ...additionalArgs);
		}

		return new this(items as T, null, this, ...additionalArgs);
	}

	abstract transform(request: RequestContextContract, ...args: any[]): any;

	private transformValue(key: string, value: any) {
		if (value instanceof MissingValue) {
			return undefined;
		}

		if (value instanceof Date && key) {
			if (this.data instanceof Model) {
				const [isDateField, originalDateField, dateField] = this.data.isDateField(key);

				if (dateField && isDateField) {
					return (dateField as ModelDateField).toPlain(value);
				}

				return value.toString();
			}

			return value.toString();
		}

		if (value instanceof ObjectId) {
			return value.toString();
		}

		if (value instanceof ApiResource) {
			return (value as ApiResource<any>).toResponse();
		}

		if (value instanceof Model) {
			return value.dehydrate();
		}

		if (typeof value === 'string') {
			return value;
		}

		//		if (typeof value === 'function') {
		//			const mergeData = this.transformData(value());
		//
		//			if (mergeData === undefined || (mergeData instanceof MissingValue)) {
		//				return undefined;
		//			}
		//
		//			return  {...mergeData, ...value};
		//		}

		if (Array.isArray(value) || Obj.isObject(value)) {
			return this.transformData(value);
		}

		return value;
	}

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
				const transformed = this.transformValue(key, data[key]);

				if (transformed !== undefined) {
					result[key] = transformed;
				}
			}
		} else {
			return this.transformValue(null, data);
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
		const context = RequestContext.get();

		if (Array.isArray(this.data)) {
			const data = this.data.map(d => {
				return new this.resource(d, null, this.resource).transform(context, ...this.additionalArgs);
			});

			if (this.pagination === null) {
				return this.transformData(data);
			}

			return this.transformData({
				data       : data,
				pagination : this.pagination,
			});
		}

		return this.transformData(this.transform(context, ...this.additionalArgs));
	}
}

