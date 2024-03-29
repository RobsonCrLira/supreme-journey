import { EmailInUseError, MissingParamError, ServerError } from '../../errors';
import {
	badRequest,
	forbidden,
	ok,
	serverError,
} from '../../helpers/http/httpHelpers';
import {
	Authentication,
	AuthenticationModel,
} from '../login/loginControllerProtocols';
import { SignUpController } from './signupController';
import {
	AccountModel,
	AddAccount,
	AddAccountModel,
	HttpRequest,
	Validation,
} from './signupControllerProtocols';

interface SutTypes {
	sut: SignUpController;
	addAccountStub: AddAccount;
	validationStub: Validation;
	authenticationStub: Authentication;
}

const makeFakeAccount = (): AccountModel => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_email@mail.com',
		password: 'any_password',
		passwordConfirmation: 'any_password',
	},
});

const makeAddAccount = (): AddAccount => {
	class addAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			return new Promise((resolve) => resolve(makeFakeAccount()));
		}
	}
	return new addAccountStub();
};

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		auth(authentication: AuthenticationModel): Promise<string | null> {
			return new Promise((resolve) => resolve('any_token'));
		}
	}
	return new AuthenticationStub();
};

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error | null {
			return null;
		}
	}
	return new ValidationStub();
};

const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication();
	const addAccountStub = makeAddAccount();
	const validationStub = makeValidation();
	const sut = new SignUpController(
		addAccountStub,
		validationStub,
		authenticationStub
	);
	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub,
	};
};

describe('SignUp Controller', () => {
	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, 'add');
		await sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});

	test('Should return 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut();
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
			return new Promise((resolve, reject) => reject(new Error()));
		});
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError()));
	});

	test('Should return 403 if AddAccount returns null', async () => {
		const { sut, addAccountStub } = makeSut();
		jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(
			new Promise((resolve) => resolve(null))
		);
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
	});

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok({ access_token: 'any_token' }));
	});

	test('Should call Validation with correct value', async () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, 'validate');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	test('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
			new MissingParamError('any_field')
		);
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError('any_field'))
		);
	});

	test('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();
		const authSpy = jest.spyOn(authenticationStub, 'auth');
		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});

	test('Should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});
