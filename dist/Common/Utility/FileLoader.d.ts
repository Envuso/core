interface FormatPathInformation {
    forTsNode: string;
    forNode: string;
}
interface ImportedModule {
    instance: any;
    name: any;
    originalPath: string;
    forRunEnvironment: string;
}
export declare class FileLoader {
    /**
     * Check if we're currently running via ts-node or regular node
     *
     * Credits to ActionHero:
     * https://github.com/actionhero/actionhero/blob/master/src/classes/process/typescript.ts
     */
    static isTypescript(): boolean;
    /**
     * Will give an array of files at the path
     *
     * @param path
     */
    static filesInPath(path: any): string[];
    /**
     * Get the name and class instance of a module from import()
     *
     * @param module
     */
    static moduleInformation(module: any): {
        instance: any;
        name: any;
    };
    /**
     * Normalize our path so that it's absolute and runs from the processes root dir
     *
     * @param pathToNormalize
     */
    static normalizePath(pathToNormalize: string): string;
    /**
     * When we're running with ts-node,
     * we want to use .ts extensions and resolve files from /src/
     *
     * When we've compiled and are running via node /dist/main.js for ex
     * We want to use .js extensions and resolve files from /dist/
     *
     * @param pathToFormat
     * @param extensions
     */
    static formatPathForRunEnvironment(pathToFormat: string, extensions?: FormatPathInformation): string;
    /**
     * Import modules from the specified path and attempt
     * to convert them to the correct run environments
     * @param path
     */
    static importModulesFrom(path: string): Promise<ImportedModule[]>;
}
export {};
