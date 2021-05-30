import { Model } from "../../Database";
export declare class Controller {
    can(permission: string, model?: Model<any> | (new () => Model<any>), ...additional: any[]): Promise<boolean>;
    cannot(permission: string, model?: Model<any> | (new () => Model<any>), ...additional: any[]): Promise<boolean>;
}
