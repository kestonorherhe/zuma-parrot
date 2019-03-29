import { Router } from 'express';
import validate from 'express-validation';

import { authLocal } from '../../services/auth.services';
import * as adminController from './admin.controllers'
import adminValidation from './admin.validations';

const routes = new Router();

routes.post('/signup', validate(adminValidation.signup), adminController.signUp);
routes.post('/login', authLocal, adminController.login);

export default routes;