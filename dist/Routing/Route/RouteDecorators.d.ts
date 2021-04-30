export declare function dto(validateOnRequest?: boolean): ParameterDecorator;
export declare const param: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const query: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const body: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const headers: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const user: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
