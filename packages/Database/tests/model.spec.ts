import {App, config} from "@envuso/app";
import {UserModel} from "../src/App/Models/UserModel";


const bootApp = async function () {
	const app = await App.bootInstance({config});
	await app.loadServiceProviders();
}

beforeAll(() => {
	return bootApp();
})


describe('models', () => {


	test('model can use be initiated', async () => {

		const m     = new UserModel();
		m.something = 'lel';

		expect(m).toBeInstanceOf(UserModel);
	})

	test('model can be saved', async () => {

		const m     = new UserModel();
		m.something = 'reee';
		await m.save();

		expect(m._id).toBeDefined();
	})

	test('model can be updated', async () => {
		const m     = new UserModel();
		m.something = 'lol'
		await m.save();

		expect(m.something).toBe('lol')

		const model = await UserModel.find<UserModel>(m._id);
		await model.update({something : 'lel'});

		expect(m._id).toBeDefined();
		expect(model.something).toBe('lel')
	})

	test('model where first', async () => {
		const user = await UserModel
			.where<UserModel>({something : 'lel'})
			.first();

		expect(user).toBeDefined();
	})

	test('model find', async () => {
		const user = await UserModel.findOne<UserModel>({something : 'lel'});

		expect(user).toBeDefined();
	})

});

