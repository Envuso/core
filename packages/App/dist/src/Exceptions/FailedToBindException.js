export class FailedToBindException extends Error {
    constructor(binding) {
        super("Cannot bind to the container");
        console.error(binding);
    }
}
//# sourceMappingURL=FailedToBindException.js.map