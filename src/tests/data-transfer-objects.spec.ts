import "reflect-metadata";

import {IsObject, IsString, MinLength, ValidateNested} from "class-validator";
import {
	DataTransferObject,
	DtoValidationException,
} from "../Routing";
import 'jest-extended';
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp(false));
afterAll(() => unloadApp());

describe('data transfer objects', () => {

	test('data transfer object validates from binding', async () => {

		class TestDTO extends DataTransferObject {
			@MinLength(1)
			@IsString()
			property: string;
		}

		try {
			//@ts-ignore
			await TestDTO.handleControllerBinding({property : ''}, true);
		} catch (error) {
			if (error instanceof DtoValidationException) {
				expect(() => true).toBeTruthy();
			}
		}
	});

	test('handles child objects', async () => {

		class ChildDTO extends DataTransferObject {
			@MinLength(1)
			@IsString()
			childProperty: string;
		}

		class TestChildDTO extends DataTransferObject {
			@MinLength(1)
			@IsString()
			property: string;

			@IsObject()
			@ValidateNested()
			child: ChildDTO;
		}

		const dto               = new TestChildDTO();
		dto.property            = '';
		dto.child               = new ChildDTO();
		dto.child.childProperty = '';

		await dto.validate(false);

		expect(dto.failed()).toBeTruthy();
		expect(Object.keys(dto.errors())).toHaveLength(2);
		expect(dto.errors()['child.childProperty']).toEqual("Child Property must be longer than or equal to 1 characters")
		expect(dto.errors()['property']).toEqual("Property must be longer than or equal to 1 characters")
	});

});


