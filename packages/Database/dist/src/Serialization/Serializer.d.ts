import { ClassType } from "../index";
export declare function dehydrateModel<T>(entity: T): Object;
export declare function hydrateModel<T>(plain: Object | null, type: ClassType<T>): T;
