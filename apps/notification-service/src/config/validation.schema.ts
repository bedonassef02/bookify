import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const validationSchema: ObjectSchema = Joi.object({
  RABBITMQ_URI: Joi.string().required(),
  MAIL_SERVICE: Joi.string().required(),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
});
