import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signupProtocols';

export class LoginController implements Controller {
	constructor(private readonly emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		if (!httpRequest.body.email) {
			return new Promise((resolve) =>
				resolve(badRequest(new MissingParamError('email')))
			);
		}

		this.emailValidator.isValid(httpRequest.body.email);

		return new Promise((resolve) =>
			resolve(badRequest(new MissingParamError('password')))
		);
	}
}
