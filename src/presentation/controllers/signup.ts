import { Controller } from '../../protocols/controller';
import { EmailValidator } from '../../protocols/emailValidator';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/httpHelpers';

class SignUpController implements Controller {
	constructor(private readonly emailValidator: EmailValidator) {
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

			for (const field of requiredFields) {
				if (!httpRequest.body[field])
					return badRequest(new MissingParamError(field));
			}

			const isValid = this.emailValidator.isValid(httpRequest.body.email);

			if (!isValid) return badRequest(new InvalidParamError('email'));
			return badRequest(new MissingParamError(''));
		} catch (error) {
			return serverError();
		}
	}
}

export { SignUpController };
