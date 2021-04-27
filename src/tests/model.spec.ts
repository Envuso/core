import "reflect-metadata";
import {User} from "../App/Models/User";
import {App} from "../AppContainer";
import {Str} from "../Common";
import {Config} from "../Config";


const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();
};

beforeAll(() => {
	return bootApp();
});


describe('models', () => {


	test('model can use be initiated', async () => {

		const m     = new User();
		m.something = 'lel';

		expect(m).toBeInstanceOf(User);
	});

	test('model can be saved', async () => {

		const m     = new User();
		m.something = 'reee';
		await m.save();

		expect(m._id).toBeDefined();
	});

	test('model can be updated', async () => {
		const m     = new User();
		m.something = 'lol';
		await m.save();

		expect(m.something).toBe('lol');

		const model = await User.find<User>(m._id);
		await model.update({something : 'lel'});

		expect(m._id).toBeDefined();
		expect(model.something).toBe('lel');
	});

	test('model where first', async () => {
		const user = await User
			.where<User>({something : 'lel'})
			.first();

		expect(user).toBeDefined();
	});

	test('model find', async () => {
		const user = await User.findOne<User>({something : 'lel'});

		expect(user).toBeDefined();
	});

	test('model create', async () => {
		const user = await User.create({
			something : '12345789'
		});

		expect(user).toBeInstanceOf(User);
		expect(user.something).toEqual('12345789');
		expect(await user.delete()).toBeTruthy();
	});

	test('updating a model via .save()', async () => {
		const random = Str.random();
		const secondRandom = Str.random();

		const user = await User.create({something : random});

		user.something = secondRandom;
		await user.save()

		const foundUser = await User.find(secondRandom, 'something');

		expect(user._id).toBeDefined();
		expect(user._id).toEqual(foundUser._id);
		expect(await user.delete()).toBeTruthy();
		expect(await foundUser.delete()).toBeTruthy();

	});

	test('updating a model via .update()', async () => {
		const random = Str.random();
		const secondRandom = Str.random();

		const user = await User.create({something : random});

		const updated = await user.update({
			something : secondRandom
		})

		expect(updated.something).toEqual(secondRandom);
		expect(updated._id).toEqual(updated._id);

		const foundUser = await User.find(secondRandom, 'something');

		expect(user.something).toEqual(secondRandom);
		expect(user._id).toEqual(foundUser._id);
		expect(await foundUser.delete()).toBeTruthy()
	});

});

