"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
//Load our env file from the dir with all envuso components
dotenv_1.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const app_1 = require("@envuso/app");
const fs_1 = __importDefault(require("fs"));
const S3Provider_1 = require("../src/Providers/S3Provider");
const Storage_1 = require("../src/Storage");
const bootApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield app_1.App.bootInstance();
        yield app.loadServiceProviders();
        fs_1.default.writeFileSync('./testfile.txt', '12345', { encoding: 'utf-8' });
        fs_1.default.writeFileSync('./testfiletwo.txt', 'abc', { encoding: 'utf-8' });
    });
};
beforeAll(() => {
    return bootApp();
});
describe('s3 storage', () => {
    test('list directories', () => __awaiter(void 0, void 0, void 0, function* () {
        const directories = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).directories('/');
        expect(directories.includes('/')).toBeTruthy();
        expect(directories.includes('app-updates/')).toBeTruthy();
        expect(directories.length).toBeGreaterThan(0);
    }));
    test('ensure unknown directory is not listed', () => __awaiter(void 0, void 0, void 0, function* () {
        const directories = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).directories('dfskjfksdjfjksdj/');
        expect(directories.length).toBe(0);
    }));
    test('creates a directory', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/create-directory';
        const createdDirectory = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).makeDirectory(directoryName);
        expect(createdDirectory).toBeTruthy();
        const dir = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).directories(directoryName);
        expect(dir).toStrictEqual([directoryName + '/']);
        const make = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).makeDirectory(directoryName);
        expect(make).toBeTruthy();
    }));
    test('deletes a directory', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/deleting-directory';
        const make = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).makeDirectory(directoryName);
        expect(make).toBeTruthy();
        const deletedDirectory = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).deleteDirectory(directoryName);
        expect(deletedDirectory).toEqual({});
        const dir = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).directories(directoryName);
        expect(dir.length).toBeFalsy();
    }));
    test('file exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/file-exists/testfile.txt';
        const response = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).put('ts-test/file-exists', {
            filename: 'testfile.txt',
            tempFilePath: './testfile.txt',
            storeAs: 'testfile.txt'
        });
        expect(response.url).toContain(directoryName);
        const exists = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).fileExists(directoryName);
        expect(exists).toBeTruthy();
        const deleted = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).remove(directoryName);
        expect(deleted).toBeTruthy();
    }));
    test('getting file contents', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/file-contents/testfiletwo.txt';
        const response = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).put('ts-test/file-contents', {
            filename: 'testfiletwo.txt',
            tempFilePath: './testfiletwo.txt',
            storeAs: 'testfiletwo.txt'
        });
        expect(response.url).toContain(directoryName);
        const exists = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).fileExists(directoryName);
        expect(exists).toBeTruthy();
        const contents = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).get(directoryName);
        expect(contents).toEqual('abc');
        const deleted = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).remove(directoryName);
        expect(deleted).toBeTruthy();
    }));
    test('deleting a file', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/delete-file/testfiletwo.txt';
        const response = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).put('ts-test/delete-file', {
            filename: 'testfiletwo.txt',
            tempFilePath: './testfiletwo.txt',
            storeAs: 'testfiletwo.txt'
        });
        expect(response.url).toContain(directoryName);
        const deleted = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).remove(directoryName);
        expect(deleted).toBeTruthy();
    }));
    test('get a url for a file', () => __awaiter(void 0, void 0, void 0, function* () {
        const directoryName = 'ts-test/url/testfiletwo.txt';
        const response = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).put('ts-test/url', {
            filename: 'testfiletwo.txt',
            tempFilePath: './testfiletwo.txt',
            storeAs: 'testfiletwo.txt'
        });
        expect(response.url).toContain(directoryName);
        const url = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).url(directoryName);
        expect(url).toEqual(response.url);
        const deleted = yield Storage_1.Storage.provider(S3Provider_1.S3Provider).remove(directoryName);
        expect(deleted).toBeTruthy();
    }));
});
//# sourceMappingURL=storage.spec.js.map