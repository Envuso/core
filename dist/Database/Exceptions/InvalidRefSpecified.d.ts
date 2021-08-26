import { Exception } from "../../Common";
export declare class InvalidRefSpecified extends Exception {
    constructor(entityName: string, ref: string);
}
