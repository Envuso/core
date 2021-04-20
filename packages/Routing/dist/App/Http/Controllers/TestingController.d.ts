import { Controller } from "../../../Controller/Controller";
import { DataTransferObject } from "../../../DataTransferObject/DataTransferObject";
import { AnotherTestingController } from "./AnotherTestingController";
declare class DTO extends DataTransferObject {
    something: string;
}
export declare class TestingController extends Controller {
    someController?: AnotherTestingController;
    constructor(someController?: AnotherTestingController);
    testGet(dt: DTO): Promise<void>;
    testMethods(dt: DTO): Promise<void>;
}
export {};
