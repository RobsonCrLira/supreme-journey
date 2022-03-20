import { Validation } from '../../protocols';

export class ValidationComposite implements Validation {
	constructor(private readonly validations: Validation[]) {
		this.validations = validations;
	}

	// eslint-disable-next-line consistent-return
	validate(input: any): Error | null {
		for (const validation of this.validations) {
			const error = validation.validate(input);
			if (error) {
				return error;
			}
		}
		return null;
	}
}
