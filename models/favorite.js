import Joi from "joi";

const schem = { id: Joi.string().required() };

const addSchema = Joi.object(schem);
const removeSchema = Joi.object(schem);

export const schemas = {
  addSchema,
  removeSchema,
};
