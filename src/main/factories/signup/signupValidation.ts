import { CompareFieldsValidations } from '../../../presentation/helpers/validators/compareFieldValidation';
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation';
import { RequiredFieldsValidations } from '../../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdaptor';

export const makeSignUpValidation = (): ValidationComposite => {
	const validations: Validation[] = [];
	for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
		validations.push(new RequiredFieldsValidations(field));
	}

	validations.push(
		new CompareFieldsValidations('password', 'passwordConfirmation')
	);

	validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
	return new ValidationComposite(validations);
};
