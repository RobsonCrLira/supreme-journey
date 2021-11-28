import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { MissingParamError } from '../errors/missingParamErrors';
import { badRequest } from '../helpers/httpHelpers';

class SignUpController implements Controller {
	handle(httpRequest: HttpRequest): HttpResponse {
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
		return badRequest(new MissingParamError(''));
	}
}

export { SignUpController };
