import {QueryBuilder} from "../../../Database/Mongo/QueryBuilder";
import type {PaginatedResponse} from "../../../Database/Mongo/Paginator";
import {QueryBuilderParts} from "../../../Database/Mongo/QueryBuilderParts";
import type {ModelContract} from "./ModelContract";

export interface PaginatorContract<T> {
	_response: PaginatedResponse<T>;
	_beforeCursor: string;
	_afterCursor: string;
	model: ModelContract<T>;
	query: QueryBuilderParts<T>;
	limit: number;

	/**
	 * Get the results of the paginated request
	 *
	 * @template T
	 * @returns {Promise<Paginator<T>>}
	 */
	getResults(queryBuilder: QueryBuilder<any>): Promise<this>;

	/**
	 * Attempt to get the before/after cursors specified on the request
	 * We'll then store them on the class
	 */
	setPageCursors(): void;

	/**
	 * Get the before cursor
	 *
	 * @returns {string | null}
	 */
	getBeforeCursor(): string | null;

	/**
	 * Get the after cursor
	 *
	 * @returns {string | null}
	 */
	getAfterCursor(): string | null;

	/**
	 * Get the response of the paginator
	 *
	 * @template T
	 * @returns {PaginatedResponse<T>}
	 */
	getResponse(): PaginatedResponse<T>;

	toJSON(): PaginatedResponse<T>;
}
