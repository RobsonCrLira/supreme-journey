import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		return new Promise((resolve) =>
			resolve(badRequest(new MissingParamError('email')))
		);
	}
}
