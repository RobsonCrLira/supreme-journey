import { DbAuthentication } from '../../../data/useCases/authentication/dbAuthentication';
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/bcryptAdapter';
import { JwtAdapter } from '../../../infra/criptography/jwtAdapter/jwtAdapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/accountMongoRepository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository';
import { LoginController } from '../../../presentation/controllers/login/loginController';
import { Controller } from '../../../presentation/protocols';
import env from '../../config/env';
import { LogControllerDecorator } from '../../decorators/logControllerDecorators';
import { makeLoginValidation } from './loginValidationFactory';

export const makeLoginController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);
	const loginController = new LoginController(
		dbAuthentication,
		makeLoginValidation()
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(loginController, logMongoRepository);
};
