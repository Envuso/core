import { ClassType, IndexOptions, SimpleIndexOptions } from "@Core";
export declare function nested(typeFunction: any): (target: any, propertyKey: string) => void;
export declare function ignore(target: any, propertyKey: any): void;
export declare function index<T = any>(type?: number | string, options?: SimpleIndexOptions<T>): (target: any, propertyKey: string) => void;
export declare function indexes<T = any>(options: IndexOptions<T>[]): (target: any) => void;
export declare function ref(modelReference: ClassType<any>): (target: any, propertyKey: string) => void;
export declare function Ids(target: any, propertyKey: string): void;
export declare function Id(target: any, propertyKey: string): void;
