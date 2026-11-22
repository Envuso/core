import {afterAll, beforeAll, describe, expect, spyOn, test} from "bun:test";
import {Book} from "../App/Models/Book";
import {User} from "../App/Models/User";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {app} from "../AppContainer/helpers";
import {Exception} from "../Common/Exception/Exception";
import {ExceptionHandler} from "../Common/Exception/ExceptionHandler";
import {Server} from "../Server/Server";
import {Storage} from "../Storage/Storage";
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

const inject = (opts: any) => app().container().resolve<Server>(Server)._server.inject(opts);

describe('query builder delete', () => {
	test('delete() without a where() throws instead of emptying the collection', async () => {
		await Book.create({title : 'must survive'} as any);
		const before = await Book.query().count();

		await expect(Book.query().delete()).rejects.toThrow(/without a where/);
		expect(await Book.query().count()).toBe(before);
	});

	test('delete() reports whether anything was deleted', async () => {
		const book = await Book.create({title : 'delete me'} as any);

		expect(await Book.query().where({_id : (book as any)._id}).delete()).toBe(true);
		expect(await Book.query().where({_id : (book as any)._id}).delete()).toBe(false);
	});

	test('truncate() empties the collection on purpose', async () => {
		await Book.create({title : 'truncate me'} as any);

		expect(await Book.query().truncate()).toBeGreaterThan(0);
		expect(await Book.query().count()).toBe(0);
	});
});

describe('model', () => {
	test('save() returns the model when inserting', async () => {
		const user = new User();
		user.name  = 'save returns this';

		const saved = await user.save();

		expect(saved).toBe(user);
		expect((saved as any)._id).toBeDefined();
		await user.delete();
	});

	test('an unsaved model has no id instead of a random one', async () => {
		const user = new User();

		expect(() => user.getModelId()).toThrow(/no _id/);
		await expect(user.delete()).rejects.toThrow(/no _id/);
	});

	test('Model.delete() is false when nothing was deleted', async () => {
		const user = await User.create({name : 'deleted twice'} as any);

		expect(await user.delete()).toBe(true);
		expect(await user.delete()).toBe(false);
	});
});

describe('@query parameters', () => {
	const get = (url: string) => inject({method : 'GET', url, headers : {accept : 'application/json'}});

	test('0 is a number, not a missing value', async () => {
		const res = await get('/testing/query/number?n=0');

		expect(res.statusCode).toBeLessThan(300);
		expect(res.json()).toEqual({n : 0, type : 'number'});
	});

	test('a value that is not a number is a 400', async () => {
		expect((await get('/testing/query/number?n=abc')).statusCode).toBe(400);
	});

	test('"false" is false', async () => {
		expect((await get('/testing/query/boolean?flag=false')).json()).toEqual({flag : false, type : 'boolean'});
		expect((await get('/testing/query/boolean?flag=1')).json()).toEqual({flag : true, type : 'boolean'});
		expect((await get('/testing/query/boolean?flag=maybe')).statusCode).toBe(400);
	});

	test('a missing parameter is null', async () => {
		expect((await get('/testing/query/number')).json()).toEqual({n : null, type : 'object'});
	});
});

describe('error responses', () => {
	test("Fastify's own client errors keep their status code", async () => {
		const badJson = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected',
			headers : {'content-type' : 'application/json', accept : 'application/json'},
			payload : '{"not json',
		});
		expect(badJson.statusCode).toBe(400);

		const badType = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected',
			headers : {'content-type' : 'application/x-unknown', accept : 'application/json'},
			payload : 'x',
		});
		expect(badType.statusCode).toBe(415);
	});

	test('exception lists match subclasses, and ignored means both lists', () => {
		class Reportable extends Exception {}
		class Ignored extends Exception {}

		const handler                = new ExceptionHandler();
		handler.reportableExceptions = [Reportable as any];
		handler.ignoredExceptions    = [Ignored as any];

		expect(handler.isReportable(new Reportable('x'))).toBe(true);
		expect(handler.isReportable(new Exception('x'))).toBe(false);
		expect(handler.shouldHandle(new Ignored('x'))).toBe(false);
		expect(handler.shouldHandle(new Reportable('x'))).toBe(true);
	});
});

describe('config repository', () => {
	test('set() and get() agree on the file name casing', () => {
		const config = app().resolve(ConfigRepository);

		config.set('Session.testing.value', 'from-set');
		expect(config.get('session.testing.value')).toBe('from-set');
		expect(config.get('Session.testing.value')).toBe('from-set');
		expect(config.has('SESSION.testing.value')).toBe(true);
	});
});

describe('multipart uploads', () => {
	async function upload(form: FormData) {
		// light-my-request takes a body + headers; let Response encode the multipart body
		const encoded = new Response(form);
		return inject({
			method  : 'POST', url : '/testing/file/upload-summary',
			headers : {'content-type' : encoded.headers.get('content-type'), accept : 'application/json'},
			payload : Buffer.from(await encoded.arrayBuffer()),
		});
	}

	test('a multipart form without a file is fine (was a 500)', async () => {
		const form = new FormData();
		form.append('title', 'no file here');

		const res = await upload(form);

		expect(res.statusCode).toBeLessThan(300);
		expect(res.json()).toEqual({files : [], fields : {title : 'no file here', note : null}});
	});

	test('every file is kept, along with fields before and after them', async () => {
		const form = new FormData();
		form.append('title', 'two files');
		form.append('a', new Blob(['first']), 'a.txt');
		form.append('b', new Blob(['second']), 'b.txt');
		form.append('note', 'after the files');

		const res = await upload(form);

		expect(res.json()).toEqual({files : ['a.txt', 'b.txt'], fields : {title : 'two files', note : 'after the files'}});
	});

	test('an empty file input is skipped', async () => {
		const form = new FormData();
		form.append('title', 'empty input');
		form.append('a', new Blob([]), '');

		expect((await upload(form)).json().files).toEqual([]);
	});
});

describe('model load()', () => {
	test('on a document deleted since it was loaded, returns the model instead of crashing', async () => {
		const user = await User.create({name : 'load after delete'} as any);
		await User.query().where({_id : (user as any)._id}).delete();

		expect(await user.load('books' as any)).toBe(user);
	});
});

describe('model indexes', () => {
	test('existing, unchanged indexes are left alone on boot', async () => {
		const model      = new User();
		const collection = model.collection();
		const drop       = spyOn(collection, 'dropIndex');
		const create     = spyOn(collection, 'createIndexes');

		// The app booted already, so User's "user-search" text index exists
		await model.createIndexes();

		expect(drop).not.toHaveBeenCalled();
		expect(create).not.toHaveBeenCalled();
		expect(await collection.indexExists('user-search')).toBe(true);

		drop.mockRestore();
		create.mockRestore();
	});
});

describe('local storage', () => {
	test('makeDirectory creates the directory itself, nested', async () => {
		const disk = Storage.disk('storage');

		expect(await disk.makeDirectory('correctness/nested/dir')).toBe(true);
		expect(await (disk as any).directoryExists('correctness/nested/dir')).toBe(true);
		await disk.deleteDirectory('correctness');
	});

	test('paths cannot escape the disk root', async () => {
		await expect(Storage.disk('storage').write('../../escaped.txt', 'nope')).rejects.toThrow(/outside of the storage disk root/);
	});

	test("written files report their real name (was 'file..txt')", async () => {
		const result = await Storage.disk('storage').write('correctness-name/file.txt', 'x');

		expect(result.originalName).toBe('file.txt');
		await Storage.disk('storage').deleteDirectory('correctness-name');
	});
});
