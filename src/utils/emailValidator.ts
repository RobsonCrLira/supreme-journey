import { EmailValidator } from '../presentation/protocols/emailValidator';

export class EmailValidatorAdapter {
	isValid(email: string): boolean {
		return false;
	}
}
