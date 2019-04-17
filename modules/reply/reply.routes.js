import { Router } from 'express';
import validate from 'express-validation';

import * as replyController from './reply.controllers'

const routes = new Router()

routes.post(
    '/',
    replyController.replyComment
)

export default routes