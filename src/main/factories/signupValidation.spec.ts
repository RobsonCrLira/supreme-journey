import { CompareFieldsValidations } from '../../presentation/helpers/validators/compareFieldValidation';
import { RequiredFieldsValidations } from '../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite';
import { makeSignUpValidation } from './signupValidation';

jest.mock('../../presentation/helpers/validators/validationComposite');

describe('SingUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const validations: Validation[] = [];
		for (const field of [
			'name',
			'email',
			'password',
			'password_confirmation',
		]) {
			validations.push(new RequiredFieldsValidations(field));
		}
		validations.push(
			new CompareFieldsValidations('password', 'password_confirmation')
		);
		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});
