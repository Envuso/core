import {ObjectId} from "mongodb";
import {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {RequestContextStore} from "../../Routing/Context/RequestContextStore";
import {ModelAttributesFilter} from "../QueryBuilderTypes";
import {QueryBuilderParts} from "./QueryBuilderParts";

export type PageCursor = 'after' | 'before';

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		before: string;
		after: string;
		hasNext: boolean;
		hasPrevious: boolean;
		total: number;
		limit: number;
	}
}

export class Paginator<T> implements PaginatorContract<T> {

	public _response: PaginatedResponse<T> = null;
	public _beforeCursor: string = null;
	public _afterCursor: string = null;

	constructor(
		public model: ModelContract<T>,
		public query: QueryBuilderParts<T>,
		public limit: number
	) {}

	/**
	 * Get the results of the paginated request
	 *
	 * @template T
	 * @returns {Promise<Paginator<T>>}
	 */
	public async getResults(): Promise<this> {
		this.setPageCursors();

		this.mergeQuery(this.setupQuery());


		const results = await this.model.queryBuilder()
			.where(this.query.getQuery())
			.limit(this.limit)
			.get();

		this._response = {
			data       : results,
			pagination : {
				before      : this._beforeCursor,
				after       : this._afterCursor,
				hasNext     : false,
				hasPrevious : false,
				total       : 0,
				limit       : this.limit,
			}
		};

		if (!results?.length)
			return this;

		const total       = await this.model.queryBuilder().where(this.query.getQuery()).count();
		const hasNext     = (results.length === this.limit) && (total > results.length);
		const hasPrevious = this.getAfterCursor() !== null;

		this._response.pagination = {
			before      : hasPrevious ? (results[0] as any)._id : null,
			after       : hasNext ? (results[results.length - 1] as any)._id : null,
			hasNext     : hasNext,
			hasPrevious : hasPrevious,
			total       : total,
			limit       : this.limit
		};

		return this;
	}

	/**
	 * Attempt to get the before/after cursors specified on the request
	 * We'll then store them on the class
	 */
	public setPageCursors() {
		const ctx = RequestContextStore.getInstance();

		this._afterCursor  = ctx.context().request.get<string>('after') ?? null;
		this._beforeCursor = ctx.context().request.get<string>('before') ?? null;
	}

	/**
	 * Get the before cursor
	 *
	 * @returns {string | null}
	 */
	public getBeforeCursor(): string | null {
		return this._beforeCursor;
	}

	/**
	 * Get the after cursor
	 *
	 * @returns {string | null}
	 */
	public getAfterCursor(): string | null {
		return this._afterCursor;
	}


	/**
	 * Prepare the query and check if we have cursors set on the request
	 *
	 * @returns {null | {_id: {}}}
	 * @private
	 */
	public setupQuery(): ModelAttributesFilter<T> {
		let query = {
			'_id' : {}
		};

		// Check if we have a before cursor set, if so lets handle that.
		if (this.getBeforeCursor()) {
			query['_id'] = {$lt : new ObjectId(this.getBeforeCursor())};

			return query;
		}

		// If we didn't have a before... then what about an after?
		if (this.getAfterCursor()) {
			query['_id'] = {$gt : new ObjectId(this.getAfterCursor())};

			return query;
		}

		return {};
	}

	/**
	 * Try to ensure that we can assign our pagination filter to the query
	 * without overwriting any thing else the developer specifies on the query
	 *
	 * @param query
	 */
	public mergeQuery(query: any): void {
		const thisQuery = this.query.getQuery();

		let currentQueryId = thisQuery?._id;

		if (currentQueryId) {
			query = {...currentQueryId, ...query._id};
		}

		if (query._id)
			(thisQuery as any)._id = query._id;

		this.query = this.query.add(query);
	}

	/**
	 * Get the response of the paginator
	 *
	 * @template T
	 * @returns {PaginatedResponse<T>}
	 */
	public getResponse(): PaginatedResponse<T> {
		return this._response;
	}

	public toJSON(): PaginatedResponse<T> {
		return this._response;
	}

}
