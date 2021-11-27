import { HttpRequest, HttpResponse } from '../../protocols/http';
import { MissingParamError } from '../errors/missingParamErrors';
import { badRequest } from '../helpers/httpHelpers';

class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body.name) {
			return badRequest(new MissingParamError('name'));
		}

		if (!httpRequest.body.email) {
			return badRequest(new MissingParamError('email'));
		}

		return {
			statusCode: 0,
			body: new MissingParamError('0'),
		};
	}
}

export { SignUpController };
