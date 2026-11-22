/**
 * Test preload (see bunfig.toml): runs ONCE per `bun test` invocation, before any spec file.
 *
 * Starts throwaway MongoDB + Redis + S3 (RustFS) containers and points the app at them via env vars.
 * Real env vars take precedence over .env (see Environment.load), so tests can never hit
 * whatever database your local .env points at.
 */
import "reflect-metadata";
import {afterAll} from "bun:test";
import {MongoDBContainer, StartedMongoDBContainer} from "@testcontainers/mongodb";
import {RedisContainer, StartedRedisContainer} from "@testcontainers/redis";
import {GenericContainer, type StartedTestContainer, Wait} from "testcontainers";
import {CreateBucketCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

const startedAt = Date.now();

// S3-compatible storage. MinIO stopped publishing Docker images in late 2025; RustFS is a
// drop-in S3 API replacement that still ships one.
const s3User   = "envuso-test";
const s3Secret = "envuso-test-secret";
const s3Server = new GenericContainer("rustfs/rustfs:1.0.6")
	.withEnvironment({RUSTFS_ACCESS_KEY : s3User, RUSTFS_SECRET_KEY : s3Secret})
	.withExposedPorts(9000)
	.withWaitStrategy(Wait.forHttp("/health", 9000).forStatusCode(200));

const [mongo, redis, s3Container]: [StartedMongoDBContainer, StartedRedisContainer, StartedTestContainer] = await Promise.all([
	new MongoDBContainer("mongo:8").start(),
	new RedisContainer("redis:8").start(),
	s3Server.start(),
]);

// S3: fresh bucket + the fixtures the storage specs expect
// (they were originally written against a real Spaces bucket containing these keys)
const s3Bucket   = "envuso-test";
const s3Endpoint = `http://${s3Container.getHost()}:${s3Container.getMappedPort(9000)}`;
const s3         = new S3Client({
	endpoint       : s3Endpoint,
	region         : "us-east-1",
	forcePathStyle : true,
	credentials    : {accessKeyId : s3User, secretAccessKey : s3Secret},
});
await s3.send(new CreateBucketCommand({Bucket : s3Bucket}));
for (const Key of ["app-updates/"]) {
	await s3.send(new PutObjectCommand({Bucket : s3Bucket, Key, Body : ""}));
}
s3.destroy();

process.env.SPACES_ENDPOINT         = s3Endpoint;
process.env.SPACES_URL              = `${s3Endpoint}/${s3Bucket}`;
process.env.SPACES_BUCKET           = s3Bucket;
process.env.SPACES_KEY              = s3User;
process.env.SPACES_SECRET           = s3Secret;
process.env.SPACES_REGION           = "us-east-1";
process.env.SPACES_FORCE_PATH_STYLE = "true";

process.env.NODE_ENV       = "test";
process.env.APP_KEY        = process.env.APP_KEY || "test-app-key-" + crypto.randomUUID();
// directConnection: the container is a single-node replica set advertising its internal hostname
process.env.DB_URL         = `${mongo.getConnectionString()}/?directConnection=true`;
process.env.DB_NAME        = "envuso_test";
process.env.REDIS_HOST     = redis.getHost();
process.env.REDIS_PORT     = String(redis.getPort());
process.env.REDIS_PASSWORD = "";

console.log(`[tests] mongo + redis + s3 containers ready in ${Date.now() - startedAt}ms`);

// Hooks registered in a preload file are global: this runs once after all spec files.
afterAll(async () => {
	await Promise.all([mongo.stop(), redis.stop(), s3Container.stop()]);
});
