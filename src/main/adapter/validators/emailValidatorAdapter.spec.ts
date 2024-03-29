import validator from 'validator';
import { EmailValidatorAdapter } from './emailValidatorAdaptor';

jest.mock('validator', () => ({
	isEmail(): boolean {
		return true;
	},
}));

const makeSut = (): EmailValidatorAdapter => {
	return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
	test('Should return false if validator returns false', () => {
		const sut = makeSut();
		jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
		const isValid = sut.isValid('invalid_email@email.com');
		expect(isValid).toBe(false);
	});

	test('Should return false if validator returns true', () => {
		const sut = makeSut();
		const isValid = sut.isValid('invalid_email@email.com');
		expect(isValid).toBe(true);
	});

	test('Should return false if validator returns true', () => {
		const sut = makeSut();
		const isEmailSpy = jest.spyOn(validator, 'isEmail');
		sut.isValid('any_email@mail.com');
		expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
	});
});
