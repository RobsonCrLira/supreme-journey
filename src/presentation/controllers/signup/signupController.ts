import {
	Controller,
	HttpRequest,
	HttpResponse,
	AddAccount,
	Validation,
} from './signupControllerProtocols';
import { badRequest, ok, serverError } from '../../helpers/http/httpHelpers';

class SignUpController implements Controller {
	constructor(
		private readonly addAccount: AddAccount,
		private readonly validation: Validation
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

			return ok(account);
		} catch (error) {
			return serverError(error);
		}
	}
}

export { SignUpController };
