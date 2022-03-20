import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '../../helpers/http/httpHelpers';
import {
	Controller,
	HttpRequest,
	HttpResponse,
	Authentication,
	Validation,
} from './loginProtocols';

export class LoginController implements Controller {
	constructor(
		private readonly authentication: Authentication,
		private readonly validation: Validation
	) {
		this.validation = validation;
		this.authentication = authentication;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body);

			if (error) {
				return badRequest(error);
			}

			const { email, password } = httpRequest.body;

			const accessToken = await this.authentication.auth(email, password);

			if (!accessToken) {
				return unauthorized();
			}

			return ok({ accessToken });
		} catch (error) {
			return serverError(error);
		}
	}
}
