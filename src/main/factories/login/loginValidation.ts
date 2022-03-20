import {
	EmailValidation,
	RequiredFieldsValidations,
	ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdaptor';

export const makeLoginValidation = (): ValidationComposite => {
	const validations: Validation[] = [];
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldsValidations(field));
	}

	validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
	return new ValidationComposite(validations);
};
