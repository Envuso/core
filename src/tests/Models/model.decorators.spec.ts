import "reflect-metadata";
import 'jest-extended';
import {DateTime} from "@envuso/date-time-helper";

import {User} from "../../App/Models/User";
import {AuthenticationServiceProvider} from "../../Authentication";
import {AuthorizationServiceProvider} from "../../Authorization/AuthorizationServiceProvider";
import {EncryptionServiceProvider} from "../../Crypt";
import {EventServiceProvider} from "../../Events";
import {InertiaServiceProvider} from "../../Packages/Inertia/InertiaServiceProvider";
import {RouteServiceProvider} from "../../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../../Session/SessionServiceProvider";
import {StorageServiceProvider} from "../../Storage";
import {bootApp, unloadApp} from "../preptests";

describe('model decorators', () => {

	beforeAll(() => bootApp(false, [
		SecurityServiceProvider,
		SessionServiceProvider,
		EventServiceProvider,
		EncryptionServiceProvider,
		AuthenticationServiceProvider,
		AuthorizationServiceProvider,
		RouteServiceProvider,
		StorageServiceProvider,
		InertiaServiceProvider,
	]));

	afterAll(async () => {
		await unloadApp(false);
	});


	test('@date decorator properly formats input/output', async () => {

		const user = await User.create({
			someRandomDate     : new Date(),
		});

		expect(user.someRandomDate).toBeInstanceOf(Date);

		const dehydrated: any = user.dehydrate();

		expect(dehydrated.someRandomDate).toEqual(user.someRandomDate.toISOString());

	});


});
