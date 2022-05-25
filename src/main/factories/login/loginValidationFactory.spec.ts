import {
	EmailValidation,
	RequiredFieldsValidations,
	ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols';
import { EmailValidator } from '../../../presentation/protocols/emailValidator';
import { makeLoginValidation } from './loginValidationFactory';

jest.mock('../../../presentation/helpers/validators/validationComposite');
const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeLoginValidation();
		const validations: Validation[] = [];
		for (const field of ['email', 'password']) {
			validations.push(new RequiredFieldsValidations(field));
		}

		validations.push(new EmailValidation('email', makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});
