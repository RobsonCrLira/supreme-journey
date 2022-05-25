import {
	CompareFieldsValidations,
	EmailValidation,
	RequiredFieldsValidations,
	ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../adapter/validators/emailValidatorAdaptor';

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
