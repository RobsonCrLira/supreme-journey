import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation';
import { RequiredFieldsValidations } from '../../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../../presentation/protocols';
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdaptor';

export const makeLoginValidation = (): ValidationComposite => {
	const validations: Validation[] = [];
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldsValidations(field));
	}

	validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
	return new ValidationComposite(validations);
};
