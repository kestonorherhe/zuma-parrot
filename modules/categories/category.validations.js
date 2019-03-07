import Joi from 'joi'

export default {
    category: {
        body: {
            category: Joi.string().min(3).required()
        }
    }
}