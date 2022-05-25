import { Router } from 'express';
import { adaptRoute } from '../adapter/expressRouteAdapter';
import { makeSignUpController } from '../factories/signup/signupFactory';

export default (router: Router): void => {
	router.post('/signup', adaptRoute(makeSignUpController()));
};
