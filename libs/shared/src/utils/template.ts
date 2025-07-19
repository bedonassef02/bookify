import { ITemplatedData } from '@app/shared';
import { join } from 'path';
import { TemplateDelegate } from 'handlebars';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Template {
  private path: string;

  compile(templateName: string, data: ITemplatedData): string {
    const template = this.parse(join(this.path, templateName));

    return template(data);
  }

  private parse(templatePath: string): TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(templatePath, 'utf-8');
    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  setPath(path: string) {
    this.path = path;
  }
}
