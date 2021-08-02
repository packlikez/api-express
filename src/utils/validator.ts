import Joi from "joi";
import Boom from "@hapi/boom";

const validator = (joiSchema: Joi.AnySchema, value: unknown) => {
  const result = joiSchema.validate(value);

  if (!result.error) return result.value;

  const errors = result.error.details
    .map((err) => {
      const key = err.context?.key;
      if (!key) return {};

      return {
        [key]: err.message,
      };
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  throw Boom.badRequest("", errors);
};

export default validator;
