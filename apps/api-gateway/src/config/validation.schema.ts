import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const validationSchema: ObjectSchema = Joi.object({
  PORT: Joi.number().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
