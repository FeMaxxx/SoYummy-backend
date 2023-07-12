import Joi from "joi";

const addSchema = Joi.object({
  ingredient: Joi.object().required(),
  recipeId: Joi.string().required(),
  measure: Joi.string().required(),
});

const removeSchema = Joi.object({
  ingredient: Joi.object().required(),
  recipeId: Joi.string().required(),
});

export const schemas = {
  addSchema,
  removeSchema,
};
