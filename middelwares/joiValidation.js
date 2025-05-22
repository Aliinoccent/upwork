const joi = require('joi');
const validation = async(req,res,next) => {
  const schema = joi.object({
  user_name: joi.string()
    .required()
    .messages({
      'any.required': 'Please enter your name',
      'string.empty': 'Please enter your name'
    }),

  email: joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
      'string.empty': 'Email is required'
    }),

  password: joi.string()
    .min(3)
    .max(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 3 characters',
      'string.max': 'Password must be at most 8 characters',
      'any.required': 'Password is required',
      'string.empty': 'Password is required'
    }),

  role: joi.string()
    .valid('admin', 'freelancer', 'employee')
    .required()
    .messages({
      'any.only': 'Role must be one of admin, freelancer, or employee',
      'any.required': 'Role is required',
      'string.empty': 'Role is required'
    })
});
    const {error}=schema.validate(req.body);
    if(error){
        console.log(error)
     return   res.status(400).json({error:error.details[0].message})
    }
    next();
}

module.exports=validation