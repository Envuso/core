import "reflect-metadata";
import {User} from "../App/Models/User";
import {App} from "../AppContainer";
import {Config} from "../Config";


const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();
}

beforeAll(() => {
	return bootApp();
})


describe('models', () => {


	test('model can use be initiated', async () => {

		const m     = new User();
		m.something = 'lel';

		expect(m).toBeInstanceOf(User);
	})

	test('model can be saved', async () => {

		const m     = new User();
		m.something = 'reee';
		await m.save();

		expect(m._id).toBeDefined();
	})

	test('model can be updated', async () => {
		const m     = new User();
		m.something = 'lol'
		await m.save();

		expect(m.something).toBe('lol')

		const model = await User.find<User>(m._id);
		await model.update({something : 'lel'});

		expect(m._id).toBeDefined();
		expect(model.something).toBe('lel')
	})

	test('model where first', async () => {
		const user = await User
			.where<User>({something : 'lel'})
			.first();

		expect(user).toBeDefined();
	})

	test('model find', async () => {
		const user = await User.findOne<User>({something : 'lel'});

		expect(user).toBeDefined();
	})

});
