import { InvalidParamError } from '../../errors';
import { Validation } from '../../protocols';

export class CompareFieldsValidations implements Validation {
	constructor(
		private readonly fieldName: string,
		private readonly fieldToCompareName: string
	) {}

	// eslint-disable-next-line consistent-return
	validate(input: any): Error | null {
		if (input[this.fieldName] !== input[this.fieldToCompareName]) {
			return new InvalidParamError(this.fieldToCompareName);
		}
		return null;
	}
}
