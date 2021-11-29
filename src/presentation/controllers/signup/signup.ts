import {
	Controller,
	EmailValidator,
	HttpRequest,
	HttpResponse,
	AddAccount,
} from './signupProtocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/httpHelpers';

class SignUpController implements Controller {
	constructor(
		private readonly emailValidator: EmailValidator,
		private readonly addAccount: AddAccount
	) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredFields = [
				'name',
				'email',
				'password',
				'passwordConfirmation',
			];
			const { name, email, password, passwordConfirmation } =
				httpRequest.body;

			for (const field of requiredFields) {
				if (!httpRequest.body[field])
					return badRequest(new MissingParamError(field));
			}

			if (password !== passwordConfirmation)
				return badRequest(
					new InvalidParamError('passwordConfirmation')
				);

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) return badRequest(new InvalidParamError('email'));

			const account = this.addAccount.add({
				name,
				email,
				password,
			});
			return {
				statusCode: 200,
				body: account,
			};
		} catch (error) {
			return serverError();
		}
	}
}

export { SignUpController };
