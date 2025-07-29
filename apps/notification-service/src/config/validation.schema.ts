import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const validationSchema: ObjectSchema = Joi.object({
  MAIL_SERVICE: Joi.string().required(),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
});
