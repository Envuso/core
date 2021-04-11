import { Controller, DataTransferObject } from "@envuso/routing";
declare class dtoshit extends DataTransferObject {
    something: string;
}
export declare class TestController extends Controller {
    /**
     * TYPE CASTING THE METHOD LIKE
     * (REQ: FASTIFYREQUEST) WILL BREAK FUCKING EVERYTHING
     *
     * @TODO: FIX PLS
     */
    testMethod(dto: dtoshit): Promise<{
        id: any;
        dto: dtoshit;
    }>;
    upload(): Promise<{
        message: string;
    }>;
}
export {};
