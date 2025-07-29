import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const validationSchema: ObjectSchema = Joi.object({
  RABBITMQ_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
  DOMAIN: Joi.string().required(),
});
