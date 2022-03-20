import { InvalidParamError } from '../../errors';
import { Validation } from './validation';

export class CompareFieldsValidations implements Validation {
	constructor(
		private readonly fieldName: string,
		private readonly fieldToCompareName: string
	) {
		this.fieldName = fieldName;
		this.fieldToCompareName = fieldToCompareName;
	}

	// eslint-disable-next-line consistent-return
	validate(input: any): Error | null {
		if (input[this.fieldName] !== input[this.fieldToCompareName]) {
			return new InvalidParamError(this.fieldToCompareName);
		}
		return null;
	}
}
