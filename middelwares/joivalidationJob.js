const joi = require("joi");
const validation = (req, res, next) => {
    const schema = joi.object({
        title: joi.string().required().messages({
            'any.required': 'Please enter title name',
            'string.empty': 'Please enter title name'
        }),
        description: joi.string().required().messages({
            'any.required': 'Please enter description',
            'string.empty': 'Please enter description'
        }),
        budget: joi.number().required().messages({
            'any.required': 'Please enter your budget',
        }),
        skills_required: joi.string().required().messages({
            'any.required': 'Please enter your skilles',
            'string.empty': 'Please enter your skilles'
        }),
        deadline: joi.number().required().messages({
            'any.required': 'Please enter a deadline',
        })
    })
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message });
    }

    next();
}

module.exports = validation;


