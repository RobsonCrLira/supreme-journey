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

			if (!email) {
				return new Promise((resolve) =>
					resolve(badRequest(new MissingParamError('email')))
				);
			}

			const isValid = this.emailValidator.isValid(email);

			if (!password) {
				return new Promise((resolve) =>
					resolve(badRequest(new MissingParamError('password')))
				);
			}

			if (!isValid) {
				return new Promise((resolve) =>
					resolve(badRequest(new InvalidParamError('email')))
				);
			}
			const token = await this.authentication.auth(email, password);

			return ok(token);
		} catch (error) {
			return serverError(error);
		}
	}
}
