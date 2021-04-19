import { Exception } from "@envuso/common";
export declare class InvalidRefSpecified extends Exception {
    constructor(entityName: string, ref: string);
}
