import { Controller } from "../../../Controller/Controller";
import { DataTransferObject } from "../../../DataTransferObject/DataTransferObject";
declare class DTO extends DataTransferObject {
}
export declare class TestingController extends Controller {
    testGet(dt: DTO): Promise<void>;
}
export {};
