import { Router } from 'express';
import validate from 'express-validation';

import * as commentController from './comment.controllers'

const routes = new Router()

routes.post(
    '/',
    commentController.createComment
)

export default routes