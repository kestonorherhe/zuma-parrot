import HTTPStatus from 'http-status'

import Category from './category.model'


export async function createCategory(req, res) {
    try {
        const category = await Category.createCategory(req.body, req.user._id);
        return res.status(HTTPStatus.CREATED).json(category);
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}

export async function getCategoryList(req, res) {
    try {
        const categories = await Category.find({})

        return res.status(HTTPStatus.OK).json(categories)
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}

export async function getCategoryById(req, res) {
    try {
        const category = await Category.findById(req.params.id)

        return res.status(HTTPStatus.OK).json(category)
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}

export async function getCategoryByTag(req, res) {
    console.log(req.query);
    let query = req.query
    try {
        const categories = await Category.find(query)

        return res.status(HTTPStatus.OK).json(categories)
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}

export async function updateCategoryById(req, res) {
    try {
        // make this so that only the super admin will be able to update categories
        const category = await Category.findByIdAndUpdate(req.params.id, req.body)

        return res.status(HTTPStatus.OK).json(category)
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}

export async function deleteCategoryById(req, res) {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        return res.status(HTTPStatus.OK).json(category)
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error)
    }
}