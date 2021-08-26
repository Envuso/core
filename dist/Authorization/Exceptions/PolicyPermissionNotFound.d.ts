import { Exception } from "../../Common";
export declare class PolicyPermissionNotFound extends Exception {
    constructor(entityName: string, permissionName: string);
}
