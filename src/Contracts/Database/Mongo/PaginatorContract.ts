import {FilterQuery} from "mongodb";
import {PaginatedResponse} from "../../../Database/Mongo/Paginator";
import {ModelContract} from "./ModelContract";

export interface PaginatorContract<T> {
	_response: PaginatedResponse<T>;
	_beforeCursor: string;
	_afterCursor: string;
	model: ModelContract<T>;
	query: FilterQuery<T> | Partial<T>;
	limit: number;

	/**
	 * Get the results of the paginated request
	 *
	 * @returns {Promise<Paginator<T>>}
	 */
	getResults(): Promise<this>;

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
	 * Prepare the query and check if we have cursors set on the request
	 *
	 * @returns {null | {_id: {}}}
	 * @private
	 */
	setupQuery(): FilterQuery<T> | Partial<T>;

	/**
	 * Try to ensure that we can assign our pagination filter to the query
	 * without overwriting any thing else the developer specifies on the query
	 *
	 * @param query
	 */
	mergeQuery(query: any): void;

	/**
	 * Get the response of the paginator
	 *
	 * @returns {PaginatedResponse<T>}
	 */
	getResponse(): PaginatedResponse<T>;

	toJSON(): PaginatedResponse<T>;
}
