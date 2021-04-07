export declare class DecoratorHelpers {
    /**
     * Get information about the types/parameters for the method/constructor
     *
     * @param target
     * @param propertyKey
     */
    static paramTypes(target: any, propertyKey?: string | symbol): any;
    /**
     * Get the type of a property
     *
     * @param target
     * @param propertyKey
     */
    static propertyType(target: any, propertyKey: string | symbol): any;
    /**
     * Get the properties of a target
     *
     * If the target is a class constructor and method is the name of a method
     * It will return the properties for the method?
     *
     * @param target
     * @param method
     */
    static properties(target: any, method?: string): any;
    /**
     * Get the return type
     *
     * @param target
     */
    static returnType(target: any): any;
    /**
     * Get the names of all parameters specified in a function
     * It seems we cannot use Reflect to obtain these, only the types
     *
     * @param func
     */
    static getParameterNames(func: Function): any[];
}
