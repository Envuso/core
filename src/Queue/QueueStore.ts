import {Redis} from "../Redis/Redis";

export interface ReservedJob {
	id: string;
	payload: string;
	/** Includes the current attempt, so the first run is attempt 1 */
	attempts: number;
}

export interface FailedJob {
	id: string;
	payload: string;
	error: string;
	failedAt: number;
}

/**
 * All queue state lives in Redis and every state change is a single Lua script,
 * so any number of processes can work the same queue without running a job twice.
 *
 * Keys (all under `name`):
 *  - :ready     list of job ids that can run now (FIFO)
 *  - :delayed   zset of job ids, scored by the time (ms) they become ready
 *  - :reserved  zset of job ids being run, scored by when the reservation expires
 *  - :payloads  hash id -> serialized job (never decoded in Lua, so it's stored byte-for-byte)
 *  - :attempts  hash id -> attempts so far
 *  - :failed    list of failed jobs (newest first, capped)
 *
 * A reservation that expires (the process died, or stopped extending it) puts the
 * job back on :ready, so jobs are never lost; they run at least once.
 */
export class QueueStore {

	public static readonly FAILED_LIMIT = 1000;

	constructor(public readonly name: string = 'queue') {
	}

	private get keys() {
		return {
			ready    : `${this.name}:ready`,
			delayed  : `${this.name}:delayed`,
			reserved : `${this.name}:reserved`,
			payloads : `${this.name}:payloads`,
			attempts : `${this.name}:attempts`,
			failed   : `${this.name}:failed`,
		};
	}

	private get redis() {
		return Redis.getInstance();
	}

	/**
	 * Add a job. With `runAt` (ms timestamp) in the future it's delayed until then.
	 */
	public async push(id: string, payload: string, runAt?: number): Promise<void> {
		const k = this.keys;

		await this.redis.eval(`
			redis.call('hset', KEYS[3], ARGV[1], ARGV[2])
			local runAt = tonumber(ARGV[3])
			if runAt > 0 then
				redis.call('zadd', KEYS[2], runAt, ARGV[1])
			else
				redis.call('rpush', KEYS[1], ARGV[1])
			end
			return 1
		`, [k.ready, k.delayed, k.payloads], [id, payload, runAt && runAt > Date.now() ? runAt : 0]);
	}

	/**
	 * Reserve up to `limit` jobs until `now + visibilityMs`.
	 * Due delayed jobs and expired reservations are moved to ready first.
	 */
	public async reserve(limit: number, visibilityMs: number, now: number = Date.now()): Promise<ReservedJob[]> {
		if (limit <= 0) {
			return [];
		}

		const k   = this.keys;
		const raw = await this.redis.eval<(string | number)[]>(`
			local now = tonumber(ARGV[1])

			local due = redis.call('zrangebyscore', KEYS[2], '-inf', now)
			for _, id in ipairs(due) do redis.call('rpush', KEYS[1], id) end
			if #due > 0 then redis.call('zremrangebyscore', KEYS[2], '-inf', now) end

			local expired = redis.call('zrangebyscore', KEYS[3], '-inf', now)
			for _, id in ipairs(expired) do redis.call('rpush', KEYS[1], id) end
			if #expired > 0 then redis.call('zremrangebyscore', KEYS[3], '-inf', now) end

			local out = {}
			local count = 0
			local limit = tonumber(ARGV[2])
			while count < limit do
				local id = redis.call('lpop', KEYS[1])
				if not id then break end

				local payload = redis.call('hget', KEYS[4], id)
				-- No payload: it was acked/failed while queued twice; drop the stale id
				if payload then
					local attempts = redis.call('hincrby', KEYS[5], id, 1)
					redis.call('zadd', KEYS[3], now + tonumber(ARGV[3]), id)
					out[#out + 1] = id
					out[#out + 1] = payload
					out[#out + 1] = attempts
					count = count + 1
				end
			end
			return out
		`, [k.ready, k.delayed, k.reserved, k.payloads, k.attempts], [now, limit, visibilityMs]);

		const jobs: ReservedJob[] = [];
		for (let i = 0; i < (raw?.length ?? 0); i += 3) {
			jobs.push({id : String(raw[i]), payload : String(raw[i + 1]), attempts : Number(raw[i + 2])});
		}

		return jobs;
	}

	/**
	 * Push the reservations of jobs that are still running out to `until` (ms).
	 * Ids that are no longer reserved are ignored.
	 */
	public async extend(ids: string[], until: number): Promise<void> {
		if (!ids.length) {
			return;
		}

		const args = ids.flatMap(id => [until, id]);

		await this.redis.eval(`return redis.call('zadd', KEYS[1], 'XX', unpack(ARGV))`, [this.keys.reserved], args);
	}

	/**
	 * The job finished; forget it.
	 */
	public async ack(id: string): Promise<void> {
		const k = this.keys;

		await this.redis.eval(`
			redis.call('zrem', KEYS[1], ARGV[1])
			redis.call('hdel', KEYS[2], ARGV[1])
			redis.call('hdel', KEYS[3], ARGV[1])
			return 1
		`, [k.reserved, k.payloads, k.attempts], [id]);
	}

	/**
	 * Retry the job at `runAt` (ms). The attempt still counts.
	 * Returns false if this process no longer held the reservation.
	 */
	public async release(id: string, runAt: number = Date.now()): Promise<boolean> {
		const k = this.keys;

		return 1 === await this.redis.eval<number>(`
			if redis.call('zrem', KEYS[1], ARGV[1]) == 0 then return 0 end
			redis.call('zadd', KEYS[2], tonumber(ARGV[2]), ARGV[1])
			return 1
		`, [k.reserved, k.delayed], [id, runAt]);
	}

	/**
	 * Undo a reservation that never started running: the attempt doesn't count,
	 * and the job goes back to the front of the queue.
	 */
	public async unreserve(id: string): Promise<void> {
		const k = this.keys;

		await this.redis.eval(`
			if redis.call('zrem', KEYS[1], ARGV[1]) == 0 then return 0 end
			redis.call('hincrby', KEYS[3], ARGV[1], -1)
			redis.call('lpush', KEYS[2], ARGV[1])
			return 1
		`, [k.reserved, k.ready, k.attempts], [id]);
	}

	/**
	 * The job won't be retried; move it to the failed list.
	 */
	public async fail(id: string, error: string): Promise<void> {
		const k = this.keys;

		await this.redis.eval(`
			redis.call('zrem', KEYS[1], ARGV[1])
			local payload = redis.call('hget', KEYS[2], ARGV[1])
			redis.call('hdel', KEYS[2], ARGV[1])
			redis.call('hdel', KEYS[3], ARGV[1])
			if payload then
				redis.call('lpush', KEYS[4], cjson.encode({id = ARGV[1], payload = payload, error = ARGV[2], failedAt = tonumber(ARGV[3])}))
				redis.call('ltrim', KEYS[4], 0, tonumber(ARGV[4]) - 1)
			end
			return 1
		`, [k.reserved, k.payloads, k.attempts, k.failed], [id, error, Date.now(), QueueStore.FAILED_LIMIT]);
	}

	public async failed(limit: number = 100): Promise<FailedJob[]> {
		const rows = await this.redis.lRange(this.keys.failed, 0, limit - 1);

		return rows.map(row => JSON.parse(row));
	}

	/**
	 * Counts per state, mostly for tests and monitoring.
	 */
	public async size(): Promise<{ ready: number, delayed: number, reserved: number, failed: number }> {
		const client = this.redis.getClient();
		const k      = this.keys;

		const [ready, delayed, reserved, failed] = await Promise.all([
			client.llen(this.redis.key(k.ready)),
			client.zcard(this.redis.key(k.delayed)),
			client.zcard(this.redis.key(k.reserved)),
			client.llen(this.redis.key(k.failed)),
		]);

		return {ready, delayed, reserved, failed};
	}

	/**
	 * Remove everything in this queue.
	 */
	public async clear(): Promise<void> {
		const client = this.redis.getClient();

		await client.del(...Object.values(this.keys).map(key => this.redis.key(key)));
	}
}
