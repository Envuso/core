import {FilterQuery, ObjectId} from "mongodb";
import {RequestContext} from "../../Routing";
import {Model} from "./Model";

type PageCursor = 'after' | 'before';

interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		before: string;
		after: string;
		hasNext: boolean;
		total: number;
		limit: number;
	}
}

export class Paginator<T> {

	private _response: PaginatedResponse<T> = null;
	private _beforeCursor: string           = null;
	private _afterCursor: string            = null;

	constructor(
		private model: Model<T>,
		private query: FilterQuery<T> | Partial<T>,
		private limit: number
	) {}

	/**
	 * Get the results of the paginated request
	 *
	 * @returns {Promise<Paginator<T>>}
	 */
	async getResults(): Promise<this> {
		this.setPageCursors();

		this.mergeQuery(this.setupQuery());

		const results = await this.model.queryBuilder()
			.where(this.query)
			.limit(this.limit)
			.get();

		this._response = {
			data       : results,
			pagination : {
				before  : this._beforeCursor,
				after   : this._afterCursor,
				hasNext : false,
				total   : 0,
				limit   : this.limit,
			}
		};

		if (!results?.length)
			return this;

		const total   = await this.model.queryBuilder().where(this.query).count();
		const hasNext = (results.length === this.limit) && (total > results.length);

		this._response.pagination = {
			before  : (results[0] as any)._id,
			after   : hasNext ? (results[results.length - 1] as any)._id : null,
			hasNext : hasNext,
			total   : total,
			limit   : this.limit
		};

		return this;
	}

	/**
	 * Attempt to get the before/after cursors specified on the request
	 * We'll then store them on the class
	 */
	private setPageCursors() {
		this._afterCursor  = RequestContext.request().get<string>('after') ?? null;
		this._beforeCursor = RequestContext.request().get<string>('before') ?? null;
	}

	/**
	 * Get the before cursor
	 *
	 * @returns {string | null}
	 */
	getBeforeCursor(): string | null {
		return this._beforeCursor;
	}

	/**
	 * Get the after cursor
	 *
	 * @returns {string | null}
	 */
	getAfterCursor(): string | null {
		return this._afterCursor;
	}


	/**
	 * Prepare the query and check if we have cursors set on the request
	 *
	 * @returns {null | {_id: {}}}
	 * @private
	 */
	private setupQuery(): FilterQuery<T> | Partial<T> {
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
	private mergeQuery(query: any): void {
		if (this.query === null) {
			this.query = {};
		}

		let currentQueryId = (this.query as any)?._id;

		if (currentQueryId) {
			query = {...currentQueryId, ...query._id};
		}

		if (query._id)
			(this.query as any)._id = query._id;

		this.query = query;
	}

	/**
	 * Get the response of the paginator
	 *
	 * @returns {PaginatedResponse<T>}
	 */
	getResponse(): PaginatedResponse<T> {
		return this._response;
	}

	toJSON(): PaginatedResponse<T> {
		return this._response;
	}

}
