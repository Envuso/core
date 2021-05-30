import { ClassType, ModelObjectId } from "../index";
export declare function dehydrateModel<T>(entity: T): Object;
export declare function hydrateModel<T>(plain: Object | null, type: ClassType<T>): T;
export declare function getModelObjectIds(entity: any): ModelObjectId[];
