import { ClassType } from "./index";
export declare function nested(typeFunction: any): (target: any, propertyKey: string) => void;
export declare function ignore(target: any, propertyKey: any): void;
export declare function ref(modelReference: ClassType<any>): (target: any, propertyKey: string) => void;
export declare function ids(target: any, propertyKey: string): void;
export declare function id(target: any, propertyKey: string): void;
export declare function policy(policy: ClassType<any>): (constructor: Function) => void;
