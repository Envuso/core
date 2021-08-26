import "reflect-metadata";

import {config} from 'dotenv';

import path from "path";
//Load our env file from the dir with all envuso components
config({path : path.join(__dirname, '..', '..', '.env')});

import fs from "fs";
import {App} from "../AppContainer";
import {Storage} from '../Storage';
import {Config} from '../Config';

const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();

	fs.writeFileSync('./testfile.txt', '12345', {encoding : 'utf-8'});
	fs.writeFileSync('./testfiletwo.txt', 'abc', {encoding : 'utf-8'});
};

beforeAll(() => {
	return bootApp();
});

describe('s3 storage', () => {

	test('list files', async () => {
		const directories = await Storage.disk('s3').files('/');

		expect(directories.includes('/')).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('list directories', async () => {
		const directories = await Storage.disk('s3').directories('/');

		expect(directories.includes('/')).toBeTruthy();
		expect(directories.includes('app-updates/')).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('ensure unknown directory is not listed', async () => {
		const directories = await Storage.disk('s3').directories('dfskjfksdjfjksdj/');

		expect(directories.length).toBe(0);
	});

	test('creates a directory', async () => {
		const directoryName = 'ts-test/create-directory';

		const createdDirectory = await Storage.disk('s3').makeDirectory(directoryName);

		expect(createdDirectory).toBeTruthy();

		const dir = await Storage.disk('s3').directories(directoryName);

		expect(dir).toStrictEqual([directoryName + '/']);


		const make = await Storage.disk('s3').makeDirectory(directoryName);
		expect(make).toBeTruthy();

	});

	test('deletes a directory', async () => {
		const directoryName = 'ts-test/deleting-directory';

		const make = await Storage.disk('s3').makeDirectory(directoryName);

		expect(make).toBeTruthy();

		const deletedDirectory = await Storage.disk('s3').deleteDirectory(directoryName);

		expect(deletedDirectory).toEqual({});

		const dir = await Storage.disk('s3').directories(directoryName);

		expect(dir.length).toBeFalsy();
	});

	test('file exists', async () => {
		const directoryName = 'ts-test/file-exists/testfile.txt';

		const response = await Storage.disk('s3').put('ts-test/file-exists', {
			filename     : 'testfile.txt',
			tempFilePath : './testfile.txt',
			storeAs      : 'testfile.txt'
		});

		expect(response.url).toContain(directoryName);

		const exists = await Storage.disk('s3').fileExists(directoryName);
		expect(exists).toBeTruthy();

		const deleted = await Storage.disk('s3').remove(directoryName);
		expect(deleted).toBeTruthy();

	});

	test('getting file contents', async () => {
		const directoryName = 'ts-test/file-contents/testfiletwo.txt';

		const response = await Storage.disk('s3').put('ts-test/file-contents', {
			filename     : 'testfiletwo.txt',
			tempFilePath : './testfiletwo.txt',
			storeAs      : 'testfiletwo.txt'
		});

		expect(response.url).toContain(directoryName);

		const exists = await Storage.disk('s3').fileExists(directoryName);
		expect(exists).toBeTruthy();

		const contents = await Storage.disk('s3').get(directoryName);

		expect(contents).toEqual('abc');

		const deleted = await Storage.disk('s3').remove(directoryName);
		expect(deleted).toBeTruthy();

	});

	test('deleting a file', async () => {
		const directoryName = 'ts-test/delete-file/testfiletwo.txt';

		const response = await Storage.disk('s3').put('ts-test/delete-file', {
			filename     : 'testfiletwo.txt',
			tempFilePath : './testfiletwo.txt',
			storeAs      : 'testfiletwo.txt'
		});

		expect(response.url).toContain(directoryName);

		const deleted = await Storage.disk('s3').remove(directoryName);
		expect(deleted).toBeTruthy();

	});

	test('get a url for a file', async () => {
		const directoryName = 'ts-test/url/testfiletwo.txt';

		const response = await Storage.disk('s3').put('ts-test/url', {
			filename     : 'testfiletwo.txt',
			tempFilePath : './testfiletwo.txt',
			storeAs      : 'testfiletwo.txt'
		});

		expect(response.url).toContain(directoryName);

		const url = await Storage.disk('s3').url(directoryName);
		expect(url).toEqual(response.url);

		const deleted = await Storage.disk('s3').remove(directoryName);
		expect(deleted).toBeTruthy();

	});

});


describe('local storage', () => {

	test('list files', async () => {
		const directories = await Storage.disk('storage').files('logs');

		expect(directories.some(d => d.includes('.log'))).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('list files recursively', async () => {
		const directories = await Storage.disk('storage').files('/', true);

		expect(directories.some(d => d.includes('logs/'))).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('list directories', async () => {
		const directories = await Storage.disk('storage').directories('/');

		expect(directories.includes('logs')).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('ensure unknown directory is not listed', async () => {
		const directories = await Storage.disk('storage').directories('/');

		expect(directories.includes('sdkjflksdj')).toBe(false);
	});

	test('creates a directory', async () => {
		const createdDirectory = await Storage.disk('storage').makeDirectory('testing/testingagain');

		expect(createdDirectory).toBeTruthy();
	});

	test('deletes a directory', async () => {
		const deleteDir = await Storage.disk('storage').deleteDirectory('testing/testingagain');

		expect(deleteDir).toBeTruthy();
	});

});

