/**
 * Pop the first x Jobs from the queue, push it onto the reserved queue and return it
 *
 * Command: pop [queue] [reserved queue] [limit]
 * Example: pop envuso-queue envuso-queue:reserved 5
 * Returns: string[] - Array of serialized Jobs
 *
 * @returns {{lua: string, numberOfKeys: number}}
 */
export function pop() {
	// TODO: We need to be able to remove Jobs from the reserved queue after some expiration period so they don't get stuck there
	return {
		numberOfKeys : 2,
		lua          : `local vals = redis.call('lpop', KEYS[1], ARGV[1])

			if (vals == false) then
				return {}
			end

			for i, val in ipairs(vals) do
				local reserved = cjson.decode(val)
				reserved['attempts'] = reserved['attempts'] + 1
				reserved = cjson.encode(reserved)
				redis.call('rpush', KEYS[2], reserved)
				vals[i] = reserved
			end

			return vals`,
	};
}

/**
 * Move Jobs that are ready to run from the delayed queue to the normal queue
 *
 * Command: migrateQueue [delayed queue] [normal queue] [time]
 * Example: migrateQueue envuso-queue:delayed envuso-queue Date.now()
 * Returns: string[] - Array of Jobs that were moved
 *
 * @returns {{lua: string, numberOfKeys: number}}
 */
export function migrateQueue() {
	return {
		numberOfKeys : 2,
		lua          : `local vals = redis.call('zrangebyscore', KEYS[1], '-inf', ARGV[1])

			if (#vals > 0) then
				redis.call('zremrangebyrank', KEYS[1], 0, #vals - 1)
				redis.call('rpush', KEYS[2], vals)
			end

			return vals`
	};
}

/**
 * Moves all values from a source list to a destination list.
 * Example;
 * source: a, b, c
 * destination: 1, 2, 3
 * Final Result;
 * source: <empty>
 * destination: a, b, c, 1, 2, 3
 *
 * Command: recoverQueue [source] [destination]
 * Example: recoverQueue envuso-queue:reserved envuso-queue
 * Returns: number - Number of values moved
 *
 * @returns {{lua: string, numberOfKeys: number}}
 */
export function moveList() {
	return {
		numberOfKeys : 2,
		lua          : `local count = redis.call('llen', KEYS[1])

		for i=1, count do
			redis.call('lmove', KEYS[1], KEYS[2], 'RIGHT', 'LEFT')
		end

		return count`
	};
}

export default {
	pop,
	migrateQueue,
	moveList
};
