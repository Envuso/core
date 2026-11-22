import {ObjectId} from "mongodb";
import type {ModelContract} from "../../Contracts/Database/Mongo/ModelContract";
import type {PaginatorContract} from "../../Contracts/Database/Mongo/PaginatorContract";
import {RequestContextStore} from "../../Routing/Context/RequestContextStore";
import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";
import {QueryBuilder} from "./QueryBuilder";
import {QueryBuilderParts} from "./QueryBuilderParts";

export type PageCursor = 'after' | 'before';

export type PaginatedResponsePagination = {
	before: string;
	after: string;
	hasNext: boolean;
	hasPrevious: boolean;
	total: number;
	limit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: PaginatedResponsePagination;
}

export class Paginator<T> implements PaginatorContract<T> {

	public _response: PaginatedResponse<T> = null;
	public _beforeCursor: string           = null;
	public _afterCursor: string            = null;

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
	public async getResults(queryBuilder: QueryBuilder<any>): Promise<this> {
		this.setPageCursors();

		// Cursors are _id values, so pages are in _id order (ascending unless orderByDesc('_id'))
		const order = queryBuilder._collectionOrder;
		if (order && order.key !== '_id') {
			throw new Error(
				`paginate() uses _id cursors and can't page by "${order.key}": the pages would skip or repeat documents. ` +
				`Remove the orderBy, or use orderByAsc/Desc('_id').`
			);
		}
		const direction: 1 | -1 = order?.direction === -1 ? -1 : 1;

		const after  = Paginator.parseCursor('after', this.getAfterCursor());
		const before = Paginator.parseCursor('before', this.getBeforeCursor());

		const total = await queryBuilder.count();

		// "after" continues in the page direction, "before" goes back: query it reversed, then flip
		const backwards = !!before && !after;
		const cursor    = after ?? before;
		const forward   = (direction === 1) !== backwards;

		if (cursor) {
			const condition = {_id : forward ? {$gt : cursor} : {$lt : cursor}};
			const filter    = this.query.getQuery();

			this.query.setQuery(Object.keys(filter ?? {}).length ? {$and : [filter, condition]} : condition);
		}

		// One extra document tells us whether there is another page
		let results = await queryBuilder
			.limit(this.limit + 1)
			.get({limit : this.limit + 1, sort : {_id : forward ? 1 : -1}});

		const hasMore = results.length > this.limit;
		results       = results.slice(0, this.limit);

		if (backwards) {
			results.reverse();
		}

		const hasNext     = backwards ? true : hasMore;
		const hasPrevious = backwards ? hasMore : !!after;
		const first       = (results[0] as any)?._id ?? null;
		const last        = (results[results.length - 1] as any)?._id ?? null;

		this._response = {
			data       : results,
			pagination : {
				before      : hasPrevious && first ? String(first) : null,
				after       : hasNext && last ? String(last) : null,
				hasNext     : results.length ? hasNext : false,
				hasPrevious : results.length ? hasPrevious : false,
				total       : total,
				limit       : this.limit,
			}
		};

		return this;
	}

	/**
	 * A cursor from the request: an _id; anything else is the client's mistake (400), not a 500
	 */
	private static parseCursor(name: string, value: any): ObjectId | null {
		if (value === null || value === undefined || value === '') {
			return null;
		}

		if (typeof value !== 'string' || !/^[a-f0-9]{24}$/i.test(value)) {
			throw new Exception(`The "${name}" cursor is invalid.`, StatusCodes.BAD_REQUEST);
		}

		return new ObjectId(value);
	}

	/**
	 * Attempt to get the before/after cursors specified on the request
	 * We'll then store them on the class
	 */
	public setPageCursors() {
		const ctx     = RequestContextStore.getInstance();
		const context = ctx.context();

		if (!context) {
			this._afterCursor  = null;
			this._beforeCursor = null;

			return;
		}

		this._afterCursor  = context.request.get<string>('after') ?? null;
		this._beforeCursor = context.request.get<string>('before') ?? null;
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
