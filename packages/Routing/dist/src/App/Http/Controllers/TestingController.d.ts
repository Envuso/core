import { Controller } from "../../../Controller/Controller";
import { DataTransferObject } from "../../../DataTransferObject/DataTransferObject";
declare class DTO extends DataTransferObject {
    something: string;
}
export declare class TestingController extends Controller {
    testGet(dt: DTO): Promise<void>;
    testMethods(dt: DTO): Promise<void>;
}
export {};
