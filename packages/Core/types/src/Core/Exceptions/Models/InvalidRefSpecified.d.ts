import { Exception } from "@App/Exceptions/Exception";
export declare class InvalidRefSpecified extends Exception {
    constructor(entityName: string, ref: string);
}
