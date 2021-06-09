import Joi from "joi";

export default function validatePayload<T>(body: T, schema: Joi.ObjectSchema) {
  const options = {
    abortEarly: true,
    noDefaults: true,
    stripUnknown: true,
  };

  const payload = Joi.validate(body, schema, options);
  return payload.error;
}
