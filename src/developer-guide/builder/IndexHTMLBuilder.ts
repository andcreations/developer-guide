import * as path from 'path';
import * as fs from 'fs';

import { Log } from '../Log';
import { DevGuideCfg } from '../DevGuideCfg';
import { indexHTMLTemplate } from './index-html-template';

/** */
export class IndexHTMLBuilder {
  /** */
  constructor(private readonly cfg: DevGuideCfg) {
  }

  /** */
  private render(
    template: string,
    properties: { [key: string]: string },
  ): string {
    let doc = template;
    Object.keys(properties).forEach(key => {
      doc = doc.replace(`{{${key}}}`, properties[key]);
    });
    return doc;
  }

  /** */
  run(): void {
    Log.section('index.html: build');

  // generate
    const properties = {
      title: this.cfg.title,
      name: this.cfg.name,
      description: this.cfg.description,
    };
    const indexHTML = this.render(indexHTMLTemplate, properties);
  
    const file = path.join(this.cfg.dstDir, 'index.html');
  // directory
    const dir = path.dirname(file);
    fs.mkdirSync(dir, { recursive: true });

  // write
    Log.info(`Writing ${path.resolve(file)}`);
    fs.writeFileSync(file, indexHTML);
  }  
}