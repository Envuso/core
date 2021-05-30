import { Model } from "../Database";
export declare type ModelConstructorOrInstantiatedModel = (Model<any>) | (new () => Model<any>);
export declare class Authorization {
    static getPolicyForModel<T extends ModelConstructorOrInstantiatedModel>(model: T): any;
    private static getPermissionFromPolicy;
    static can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model?: T, ...additional: any[]): Promise<boolean>;
    static cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model?: T, ...additional: any[]): Promise<boolean>;
}
