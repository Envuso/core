import path from "path";
import {FileLoader} from "../Common/Utility/FileLoader";

// Paths are compared after normalising separators, so the specs run the same on Windows and posix
const normalise = (files: string[]) => files.map(f => path.normalize(f)).sort();

describe("FileLoader", () => {

	test("a missing directory has no files (instead of throwing)", async () => {
		const pattern = path.join(process.cwd(), 'src', 'does-not-exist', '**', '*.ts');

		expect(FileLoader.filesInPath(pattern)).toEqual([]);
		expect(await FileLoader.filesInPathAsync(pattern)).toEqual([]);
	});

	test("relative patterns return paths relative to the process cwd", () => {
		const files = normalise(FileLoader.filesInPath(path.join('src', 'Queue', 'Jobs', '*.ts')));

		expect(files).toContain(path.normalize('src/Queue/Jobs/Job.ts'));
	});

	test("absolute patterns return absolute paths", () => {
		const files = normalise(FileLoader.filesInPath(path.join(process.cwd(), 'src', 'Queue', '**', '*.ts')));

		expect(files).toContain(path.join(process.cwd(), 'src', 'Queue', 'Jobs', 'Job.ts'));
		expect(files.every(f => path.isAbsolute(f))).toBe(true);
	});

	test("a plain file path (no glob) returns that file", () => {
		// How queue workers load a job: its namespace is the job's file path
		const files = normalise(FileLoader.filesInPath(path.join('src', 'Queue', 'Jobs', 'Job.ts')));

		expect(files).toEqual([path.normalize('src/Queue/Jobs/Job.ts')]);
	});

	test("only files by default", () => {
		const files = FileLoader.filesInPath(path.join('src', 'Queue', '*'));

		expect(files.some(f => f.endsWith('Jobs'))).toBe(false);
	});
});
