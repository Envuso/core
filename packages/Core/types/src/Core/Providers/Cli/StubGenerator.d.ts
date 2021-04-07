export declare class StubGenerator {
    private readonly stub;
    private stubContents;
    private readonly nameSuffix;
    private readonly stubPublishPath;
    private fileNameAndLocation;
    constructor(stub: string, nameSuffix: string, stubPublishPath: string[], fileNameAndLocation: string);
    parseFileName(): string;
    replace(vars: Object): this;
    save(): void;
}
