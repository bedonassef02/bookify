import Handlebars from 'handlebars';
import { ITemplatedData } from '@app/shared';
import { readFileSync } from 'fs';

export function parseTemplate(
  templatePath: string,
): Handlebars.TemplateDelegate<ITemplatedData> {
  const templateText = readFileSync(templatePath, 'utf-8');
  return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
}
