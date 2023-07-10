import Joi from "joi";

const subscribeSchema = Joi.object({ email: Joi.string().required() });

export const schemas = {
  subscribeSchema,
};
