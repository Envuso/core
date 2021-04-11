import { StatusCodes } from "http-status-codes";
export declare class Exception extends Error {
    response: any;
    code: StatusCodes;
    constructor(message: string, code?: StatusCodes);
}
