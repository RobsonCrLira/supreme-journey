import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelpers';
import { LoginController } from './login';

describe('Login Controller', () => {
	test('Should return 400 if email is provided', async () => {
		const sut = new LoginController();
		const httpRequest = {
			body: { password: 'any_password' },
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError('email'))
		);
	});
});