import { MissingParamError } from '../../errors';
import { Validation } from '../../protocols';

export class RequiredFieldsValidations implements Validation {
	constructor(private readonly fieldName: string) {
		this.fieldName = fieldName;
	}

	// eslint-disable-next-line consistent-return
	validate(input: any): Error | null {
		if (!input[this.fieldName]) {
			return new MissingParamError(this.fieldName);
		}
		return null;
	}
}
