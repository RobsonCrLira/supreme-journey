import {
	Controller,
	EmailValidator,
	HttpRequest,
	HttpResponse,
} from '../../protocols';
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
			const { email, password, passwordConfirmation } = httpRequest.body;

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
			return serverError();
		} catch (error) {
			return serverError();
		}
	}
}

export { SignUpController };
