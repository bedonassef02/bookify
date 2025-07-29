import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const validationSchema: ObjectSchema = Joi.object({
  RABBITMQ_URL: Joi.string().required(),
  PORT: Joi.number().required(),
  MONGODB_URI: Joi.string().required(),
});
