import "reflect-metadata";
import "./preptests";
import {DateTime} from "@envuso/date-time-helper";
import {Queue} from "../Queue/Queue";
import {QueueStore} from "../Queue/QueueStore";
import {Redis} from "../Redis/Redis";
import {bootApp, unloadApp} from "./preptests";
import {AlwaysFailsJob, FlakyJob, RecordingJob} from "./Jobs/QueueTestJobs";

beforeAll(() => bootApp());
afterAll(async () => {
	await Queue.shutdown();
	await unloadApp();
});

describe("queue store", () => {
	let store: QueueStore;
	const now = 1_000_000;

	beforeEach(() => {
		store = new QueueStore(`queue-store-test-${Math.random().toString(36).slice(2)}`);
	});
	afterEach(() => store.clear());

	test("a reserved job is not handed out twice", async () => {
		await store.push('a', '{"x":1}');

		const first  = await store.reserve(5, 1000, now);
		const second = await store.reserve(5, 1000, now);

		expect(first).toEqual([{id : 'a', payload : '{"x":1}', attempts : 1}]);
		expect(second).toEqual([]);
	});

	test("concurrent reservers never get the same job", async () => {
		for (let i = 0; i < 20; i++) {
			await store.push(`job-${i}`, `{}`);
		}

		const batches = await Promise.all([1, 2, 3, 4].map(() => store.reserve(10, 1000, now)));
		const ids     = batches.flat().map(j => j.id);

		expect(ids.length).toBe(20);
		expect(new Set(ids).size).toBe(20);
	});

	test("jobs come out in order and respect the limit", async () => {
		await store.push('a', '{}');
		await store.push('b', '{}');
		await store.push('c', '{}');

		expect((await store.reserve(2, 1000, now)).map(j => j.id)).toEqual(['a', 'b']);
		expect((await store.reserve(2, 1000, now)).map(j => j.id)).toEqual(['c']);
	});

	test("ack removes the job completely", async () => {
		await store.push('a', '{}');
		await store.reserve(1, 1000, now);
		await store.ack('a');

		expect(await store.size()).toEqual({ready : 0, delayed : 0, reserved : 0, failed : 0});
		expect(await store.reserve(1, 1000, now + 10_000)).toEqual([]);
	});

	test("an expired reservation is picked up again with the attempt counted", async () => {
		await store.push('a', '{}');
		await store.reserve(1, 1000, now);

		expect(await store.reserve(1, 1000, now + 999)).toEqual([]);
		expect(await store.reserve(1, 1000, now + 1000)).toEqual([{id : 'a', payload : '{}', attempts : 2}]);
	});

	test("extend keeps a running job reserved", async () => {
		await store.push('a', '{}');
		await store.reserve(1, 1000, now);
		await store.extend(['a', 'not-reserved'], now + 5000);

		expect(await store.reserve(1, 1000, now + 2000)).toEqual([]);
		expect((await store.size()).reserved).toBe(1);
		expect(await store.reserve(1, 1000, now + 5000)).toHaveLength(1);
	});

	test("release retries later, only for the reservation holder", async () => {
		await store.push('a', '{}');
		await store.reserve(1, 1000, now);

		expect(await store.release('a', now + 500)).toBe(true);
		expect(await store.release('a', now + 500)).toBe(false);

		expect(await store.reserve(1, 1000, now + 499)).toEqual([]);
		expect(await store.reserve(1, 1000, now + 500)).toEqual([{id : 'a', payload : '{}', attempts : 2}]);
	});

	test("unreserve puts the job back at the front without counting the attempt", async () => {
		await store.push('a', '{}');
		await store.push('b', '{}');
		await store.reserve(1, 1000, now);
		await store.unreserve('a');

		expect(await store.reserve(1, 1000, now)).toEqual([{id : 'a', payload : '{}', attempts : 1}]);
	});

	test("delayed jobs wait until they are due", async () => {
		const runAt = Date.now() + 60_000;
		await store.push('a', '{}', runAt);

		expect(await store.reserve(1, 1000, runAt - 1)).toEqual([]);
		expect((await store.reserve(1, 1000, runAt)).map(j => j.id)).toEqual(['a']);
	});

	test("fail moves the job to the failed list", async () => {
		await store.push('a', '{"big":12345678901234567890}');
		await store.reserve(1, 1000, now);
		await store.fail('a', 'Error: boom');

		const failed = await store.failed();

		expect(failed).toHaveLength(1);
		expect(failed[0].id).toBe('a');
		expect(failed[0].error).toBe('Error: boom');
		// The payload is stored byte for byte; Lua never re-encodes it
		expect(failed[0].payload).toBe('{"big":12345678901234567890}');
		expect(await store.size()).toEqual({ready : 0, delayed : 0, reserved : 0, failed : 1});
	});
});

describe("queue workers", () => {
	const name = `queue-e2e-${Math.random().toString(36).slice(2)}`;
	let queue: Queue;

	beforeAll(() => {
		queue = new Queue({name, workers : 2, waitTimeMs : 50, visibilityTimeoutMs : 10_000});
		queue.run();
	});
	afterAll(async () => {
		await queue.getStore().clear();
		await Queue.shutdown();
	});

	async function waitFor<T>(key: string, timeoutMs = 20_000): Promise<T> {
		const until = Date.now() + timeoutMs;

		while (Date.now() < until) {
			const value = await Redis.get<T>(key);
			if (value !== null) {
				return value;
			}
			await Bun.sleep(50);
		}

		throw new Error(`Timed out waiting for ${key}`);
	}

	test("runs a job with the default retries = 0", async () => {
		await new RecordingJob('basic', 1_700_000_000_123).dispatch();

		expect(await waitFor('queue-test:basic')).toEqual({attempts : 1, bigNumber : 1_700_000_000_123});
	}, 30_000);

	test("retries a failing job until it succeeds", async () => {
		await new FlakyJob('flaky', 3).dispatch();

		expect(await waitFor('queue-test:flaky')).toEqual({attempts : 3});
	}, 30_000);

	test("calls failed() and records the job once retries run out", async () => {
		await new AlwaysFailsJob('fails').dispatch();

		expect(await waitFor('queue-test:fails:failed')).toEqual({attempts : 2, message : 'always fails'});

		await Bun.sleep(200);
		const failed = await queue.getStore().failed();
		expect(failed.some(f => f.payload.includes('"fails"') && f.error.includes('always fails'))).toBe(true);
	}, 30_000);

	test("delayed jobs run once due", async () => {
		const start = Date.now();

		await new RecordingJob('delayed').delay(DateTime.now().addSeconds(1)).dispatch();

		await waitFor('queue-test:delayed');
		expect(Date.now() - start).toBeGreaterThanOrEqual(900);
	}, 30_000);

	test("many jobs each run exactly once", async () => {
		await Promise.all(Array.from({length : 20}, (_, i) => new RecordingJob(`many-${i}`).dispatch()));

		const results = await Promise.all(Array.from({length : 20}, (_, i) => waitFor<{ attempts: number }>(`queue-test:many-${i}`)));

		expect(results.every(r => r.attempts === 1)).toBe(true);
		expect(await queue.getStore().size()).toMatchObject({ready : 0, delayed : 0});
	}, 30_000);
});
