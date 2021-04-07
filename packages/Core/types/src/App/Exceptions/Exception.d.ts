import { StatusCodes } from "http-status-codes";
export declare class Exception extends Error {
    response: any;
    private _code;
    constructor(message: string, code?: StatusCodes);
    code(): StatusCodes;
}
