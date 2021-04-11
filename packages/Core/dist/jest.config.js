module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/*.test.ts",
        //		"**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "moduleNameMapper": {
        "^@App/(.*)": "<rootDir>/src/App/$1",
        "^@AppControllers/(.*)": "<rootDir>/src/App/Http/Controller/$1",
        "^@AppMiddlewares/(.*)": "<rootDir>/src/App/Http/Middleware/$1",
        "^@Config": "<rootDir>/src/Config/run-dev.ts",
        "^Components/(.*)": "<rootDir>/src/components/$1"
    }
};
//# sourceMappingURL=jest.config.js.map