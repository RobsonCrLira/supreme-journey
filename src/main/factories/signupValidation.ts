import { CompareFieldsValidations } from '../../presentation/helpers/validators/compareFieldValidation';
import { RequiredFieldsValidations } from '../../presentation/helpers/validators/requiredFieldValidation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite';

export const makeSignUpValidation = (): ValidationComposite => {
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

	return new ValidationComposite(validations);
};
