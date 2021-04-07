import "@Core/Bootstrap";
import {App} from "@Core/App";
import {resolve} from "@Core/Helpers";
import {SpacesProvider} from "@Providers/Storage/StorageProviders/SpacesProvider";
import * as fs from "fs";


//@ts-ignore
global.disableConsoleLogs = false;
const app                 = new App();

async function prepare() {

	app.registerProviders();
	await app.registerProviderBindings();
	await app.bootProviders();


	fs.writeFileSync('./test.txt', 'wtf12345', {encoding : 'utf-8'});
	fs.writeFileSync('./testwtf.txt', 'wtf', {encoding : 'utf-8'});
}

async function unPrepare(){
	fs.rmSync('./test.txt');
	fs.rmSync('./testwtf.txt');

	await resolve(SpacesProvider).deleteDirectory('ts-test/');

	app.down();
}

beforeAll(() => {
	return prepare();
});

afterAll(() => {
	return unPrepare();
})


describe('Digital ocean spaces', () => {
	test('list directories', async () => {
		const directories = await resolve(SpacesProvider).directories('/');

		expect(directories.includes('/')).toBeTruthy();
		expect(directories.includes('app-updates/')).toBeTruthy();
		expect(directories.length).toBeGreaterThan(0);
	});

	test('ensure unknown directory is not listed', async () => {
		const directories = await resolve(SpacesProvider).directories('dfskjfksdjfjksdj/');

		expect(directories.length).toBe(0);
	});

	test('creates a directory', async () => {
		const directoryName = 'ts-test/create-directory';

		const createdDirectory = await resolve(SpacesProvider).makeDirectory(directoryName);

		expect(createdDirectory).toBeTruthy()

		const dir = await resolve(SpacesProvider).directories(directoryName)

		expect(dir).toStrictEqual([directoryName + '/'])


		const make = await resolve(SpacesProvider).makeDirectory(directoryName)
		expect(make).toBeTruthy();

	});

	test('deletes a directory', async () => {
		const directoryName = 'ts-test/deleting-directory';

		const make = await resolve(SpacesProvider).makeDirectory(directoryName)

		expect(make).toBeTruthy();

		const deletedDirectory = await resolve(SpacesProvider).deleteDirectory(directoryName);

		expect(deletedDirectory).toEqual({});

		const dir = await resolve(SpacesProvider).directories(directoryName)

		expect(dir.length).toBeFalsy()
	});

	test('file exists', async () => {
		const directoryName = 'ts-test/file-exists/test.txt';

		const response = await resolve(SpacesProvider).put('ts-test/file-exists', {
			filename : 'test.txt',
			filepath : './test.txt',
			storeAs  : 'test.txt'
		})

		expect(response.url).toContain(directoryName);

		const exists = await resolve(SpacesProvider).fileExists(directoryName);
		expect(exists).toBeTruthy();

		const deleted = await resolve(SpacesProvider).remove(directoryName);
		expect(deleted).toBeTruthy()

	});

	test('getting file contents', async () => {
		const directoryName = 'ts-test/file-contents/testwtf.txt';

		const response = await resolve(SpacesProvider).put('ts-test/file-contents', {
			filename : 'testwtf.txt',
			filepath : './testwtf.txt',
			storeAs  : 'testwtf.txt'
		})

		expect(response.url).toContain(directoryName);

		const exists = await resolve(SpacesProvider).fileExists(directoryName);
		expect(exists).toBeTruthy();

		const contents = await resolve(SpacesProvider).get(directoryName);

		expect(contents).toEqual('wtf');

		const deleted = await resolve(SpacesProvider).remove(directoryName);
		expect(deleted).toBeTruthy()

	});

	test('deleting a file', async () => {
		const directoryName = 'ts-test/delete-file/testwtf.txt';

		const response = await resolve(SpacesProvider).put('ts-test/delete-file', {
			filename : 'testwtf.txt',
			filepath : './testwtf.txt',
			storeAs  : 'testwtf.txt'
		})

		expect(response.url).toContain(directoryName);

		const deleted = await resolve(SpacesProvider).remove(directoryName);
		expect(deleted).toBeTruthy()

	});

	test('get a url for a file', async () => {
		const directoryName = 'ts-test/url/testwtf.txt';

		const response = await resolve(SpacesProvider).put('ts-test/url', {
			filename : 'testwtf.txt',
			filepath : './testwtf.txt',
			storeAs  : 'testwtf.txt'
		})

		expect(response.url).toContain(directoryName);

		const url = await resolve(SpacesProvider).url(directoryName);
		expect(url).toEqual(response.url);

		const deleted = await resolve(SpacesProvider).remove(directoryName);
		expect(deleted).toBeTruthy()

	});

})



