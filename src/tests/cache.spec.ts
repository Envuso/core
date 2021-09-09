import "./preptests";
import {Cache} from "../Cache";
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

describe("cache", () => {

	test("can set key", async () => {
		const res = await Cache.put("SomeRandomValue", 10);

		expect(res).toEqual(true);
	});

	test("can get key", async () => {
		const value = await Cache.get("SomeRandomValue");

		expect(value).toEqual(10);
	});

	test("can remove key", async () => {
		await Cache.put("SomeRandomValueTwo", 2);

		const removed = await Cache.remove("SomeRandomValueTwo");
		const has = await Cache.has("SomeRandomValueTwo");

		expect(removed).toEqual(true);
		expect(has).toEqual(false);
	});

});

