import { MissingParamError } from '../../errors';
import { RequiredFieldsValidations } from './requiredFieldValidation';

describe('Required Field Validation', () => {
	test('Should return a MissingParamError is validation fails', () => {
		const sut = new RequiredFieldsValidations('field');
		const error = sut.validate({ name: 'any_name' });
		expect(error).toEqual(new MissingParamError('field'));
	});
});
