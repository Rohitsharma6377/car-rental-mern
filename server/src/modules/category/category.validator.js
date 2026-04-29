import joi from "joi";

export const createCategorySchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    image: joi.string(),
    is_active : joi.boolean(),
});

export const updateCategorySchema =  joi.object({
    name: joi.string(),
    description: joi.string(),
    image: joi.string(),
    is_active : joi.boolean(),
})
