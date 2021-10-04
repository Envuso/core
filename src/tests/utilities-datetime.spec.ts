import "./preptests";
import {DateTime, DateTimeComparisonType} from "../Common";


describe('datetime', () => {

	test('using correct diffForHumans format', async () => {
		const date = DateTime.now();

		expect(date.subHours(1).diffForHumans()).toEqual('an hour ago');
	});

	test('using current to other diffForHumans type', async () => {
		const date  = DateTime.now();
		const other = DateTime.now().subHours(1);
		const diff  = date.diffForHumans(other, DateTimeComparisonType.CURRENT_TO_OTHER);

		expect(diff).toEqual('an hour ago');
	});

	test('using other to current diffForHumans type', async () => {
		const date  = DateTime.now();
		const other = DateTime.now().subHours(1);
		const diff  = date.diffForHumans(other, DateTimeComparisonType.OTHER_TO_CURRENT);

		expect(diff).toEqual('in an hour');
	});

	test('using withoutSuffix', async () => {
		const date  = DateTime.now();
		const other = DateTime.now().subHours(1);
		const diff  = date.diffForHumans(other, DateTimeComparisonType.OTHER_TO_CURRENT, true);

		expect(diff).toEqual('an hour');
	});


});
