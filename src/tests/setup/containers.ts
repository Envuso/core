/**
 * Test preload (see bunfig.toml): runs ONCE per `bun test` invocation, before any spec file.
 *
 * Starts throwaway MongoDB + Redis containers and points the app at them via env vars.
 * Real env vars take precedence over .env (see Environment.load), so tests can never hit
 * whatever database your local .env points at.
 */
import "reflect-metadata";
import {afterAll} from "bun:test";
import {MongoDBContainer, StartedMongoDBContainer} from "@testcontainers/mongodb";
import {RedisContainer, StartedRedisContainer} from "@testcontainers/redis";

const startedAt = Date.now();

const [mongo, redis]: [StartedMongoDBContainer, StartedRedisContainer] = await Promise.all([
	new MongoDBContainer("mongo:8").start(),
	new RedisContainer("redis:8").start(),
]);

process.env.NODE_ENV       = "test";
process.env.APP_KEY        = process.env.APP_KEY || "test-app-key-" + crypto.randomUUID();
// directConnection: the container is a single-node replica set advertising its internal hostname
process.env.DB_URL         = `${mongo.getConnectionString()}/?directConnection=true`;
process.env.DB_NAME        = "envuso_test";
process.env.REDIS_HOST     = redis.getHost();
process.env.REDIS_PORT     = String(redis.getPort());
process.env.REDIS_PASSWORD = "";

console.log(`[tests] mongo + redis containers ready in ${Date.now() - startedAt}ms`);

// Hooks registered in a preload file are global: this runs once after all spec files.
afterAll(async () => {
	await Promise.all([mongo.stop(), redis.stop()]);
});
