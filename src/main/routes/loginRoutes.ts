import { Router } from 'express';
import { adaptRoute } from '../adapter/express/expressRouteAdapter';
import { makeLoginController } from '../factories/login/loginFactory';
import { makeSignUpController } from '../factories/signup/signupFactory';

export default (router: Router): void => {
	router.post('/signup', adaptRoute(makeSignUpController()));
	router.post('/login', adaptRoute(makeLoginController()));
};
