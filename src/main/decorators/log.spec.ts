import { LogErrorRepository } from '../../data/protocols/logErrorRepository';
import { AccountModel } from '../../domain/models/account';
import { ok, serverError } from '../../presentation/helpers/http/httpHelpers';
import {
	Controller,
	HttpRequest,
	HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
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

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';
	return serverError(fakeError);
};

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			return new Promise((resolve) => resolve(ok(makeFakeAccount())));
		}
	}
	return new ControllerStub();
};
const makeLogErrorController = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async logError(stack: string): Promise<void> {
			return new Promise((resolve) => resolve());
		}
	}
	return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const logErrorRepositoryStub = makeLogErrorController();
	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	);
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub,
	};
};

describe('Log Controller Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, 'handle');
		await sut.handle(makeFakeRequest());
		expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
	});

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});

	test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
			new Promise((resolve) => resolve(makeFakeServerError()))
		);
		await sut.handle(makeFakeRequest());
		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
