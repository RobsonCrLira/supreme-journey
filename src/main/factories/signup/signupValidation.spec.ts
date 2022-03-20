import { CompareFieldsValidations } from '../../../presentation/helpers/validators/compareFieldValidation';
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation';
import { RequiredFieldsValidations } from '../../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../../presentation/protocols';
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite';
import { EmailValidator } from '../../../presentation/protocols/emailValidator';
import { makeSignUpValidation } from './signupValidation';

jest.mock('../../../presentation/helpers/validators/validationComposite');
const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

describe('SingUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const validations: Validation[] = [];
		for (const field of [
			'name',
			'email',
			'password',
			'passwordConfirmation',
		]) {
			validations.push(new RequiredFieldsValidations(field));
		}
		validations.push(
			new CompareFieldsValidations('password', 'passwordConfirmation')
		);

		validations.push(new EmailValidation('email', makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});
