import joi from 'joi';

export const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid('user','vendor').optional()
})

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})

export const forgetSchema = joi.object({
    email: joi.string().email().required(),
})

export const resetSchema = joi.object({
    newPassword: joi.string().min(6).required(),
})
export const emailOnlySchema = joi.object({
    email: joi.string().email().required(),
})
export const otpSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
})