import { Authentication } from '../../../domain/usecase/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/httpHelpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signupProtocols';

export class LoginController implements Controller {
	constructor(
		private readonly emailValidator: EmailValidator,
		private readonly authentication: Authentication
	) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { email, password } = httpRequest.body;
			const requiredFields = ['email', 'password'];

			for (const field of requiredFields) {
				if (!httpRequest.body[field])
					return badRequest(new MissingParamError(field));
			}

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}

			const token = await this.authentication.auth(email, password);

			return ok(token);
		} catch (error) {
			return serverError(error);
		}
	}
}
