import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  transport: {
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  tls: {
    rejectUnauthorized: false,
  },
}));
