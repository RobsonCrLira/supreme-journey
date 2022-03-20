import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation';
import { RequiredFieldsValidations } from '../../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../../presentation/protocols';
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite';
import { EmailValidator } from '../../../presentation/protocols/emailValidator';
import { makeLoginValidation } from './loginValidation';

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
