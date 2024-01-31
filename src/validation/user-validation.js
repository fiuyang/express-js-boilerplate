import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required()
});

const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const forgotPasswordUserValidation = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordUserValidation = Joi.object({
    password: Joi.string().min(8).max(15).required(),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required()
});

const checkOtpUserValidation = Joi.object({
    otp: Joi.number().integer().required(),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(100).optional()
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    forgotPasswordUserValidation,
    resetPasswordUserValidation,
    checkOtpUserValidation
}
