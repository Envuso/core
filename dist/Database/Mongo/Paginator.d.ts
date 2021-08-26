import { FilterQuery } from "mongodb";
import { Model } from "./Model";
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        before: string;
        after: string;
        hasNext: boolean;
        hasPrevious: boolean;
        total: number;
        limit: number;
    };
}
export declare class Paginator<T> {
    private model;
    private query;
    private limit;
    private _response;
    private _beforeCursor;
    private _afterCursor;
    constructor(model: Model<T>, query: FilterQuery<T> | Partial<T>, limit: number);
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
    private setPageCursors;
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
    private setupQuery;
    /**
     * Try to ensure that we can assign our pagination filter to the query
     * without overwriting any thing else the developer specifies on the query
     *
     * @param query
     */
    private mergeQuery;
    /**
     * Get the response of the paginator
     *
     * @returns {PaginatedResponse<T>}
     */
    getResponse(): PaginatedResponse<T>;
    toJSON(): PaginatedResponse<T>;
}
export {};
