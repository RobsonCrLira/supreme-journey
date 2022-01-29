import {
	Controller,
	HttpRequest,
	HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse = {
				statusCode: 200,
				body: {
					name: 'Robson',
				},
			};
			return new Promise((resolve) => resolve(httpResponse));
		}
	}
	return new ControllerStub();
};

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const sut = new LogControllerDecorator(controllerStub);
	return {
		sut,
		controllerStub,
	};
};

describe('Log Controller Decorator', () => {
	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: 'Robson',
			},
		});
	});
});
