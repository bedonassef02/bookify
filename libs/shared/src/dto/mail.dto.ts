export class MailDto {
  from?: string;
  to: string | string[];
  subject: string;
  text: string;
}
