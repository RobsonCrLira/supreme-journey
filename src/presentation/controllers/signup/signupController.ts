import { badRequest, ok, serverError } from '../../helpers/http/httpHelpers';
import {
	AddAccount,
	Authentication,
	Controller,
	HttpRequest,
	HttpResponse,
	Validation,
} from './signupControllerProtocols';

class SignUpController implements Controller {
	constructor(
		private readonly addAccount: AddAccount,
		private readonly validation: Validation,
		private readonly authentication: Authentication
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body);

			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = httpRequest.body;

			const account = await this.addAccount.add({
				name,
				email,
				password,
			});
			const access_token = await this.authentication.auth({
				email,
				password,
			});
			return ok({ access_token });
		} catch (error) {
			return serverError(error);
		}
	}
}

export { SignUpController };
