import { Router } from 'express'
import validate from 'express-validation'

import * as categoryControllers from './category.controllers'
import categoryValidations from './category.validations'
import { authJwt } from '../../services/auth.services'

const routes = new Router()

routes.post(
    '/',
    authJwt,
    validate(categoryValidations.category),
    categoryControllers.createCategory
)

// get category list
routes.get(
    '/',
    // authJwt,
    categoryControllers.getCategoryList
)

// get category by :id
routes.get(
    '/:id',
    categoryControllers.getCategoryById
)

routes.get(
    '/category/tag',
    // authJwt,
    categoryControllers.getCategoryByTag
)

// get category by :id and update
routes.put(
    '/:id',
    authJwt,
    validate(categoryValidations.category),
    categoryControllers.updateCategoryById
)

// delete category by :id
routes.delete(
    '/:id',
    authJwt,
    categoryControllers.deleteCategoryById
)

export default routes;