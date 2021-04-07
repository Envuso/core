export interface ControllerMetadata {
    path: string;
    target: any;
}
export declare function controller(path?: string): (target: any) => void;
