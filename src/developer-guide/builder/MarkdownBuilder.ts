import * as path from 'path';
import * as fs from 'fs';

import { Log } from '../Log';
import { DevGuideCfg } from '../DevGuideCfg';
import { DocPartial } from '../partial';

/** */
const PARTIAL_REGEX = /^\$partial<(.+)>$/;

/** */
export class MarkdownBuilder {
  /** */
  constructor(private readonly cfg: DevGuideCfg) {
  }

  /** */
  private isMarkdownFile(file: string): boolean {
    return file.endsWith('.md');
  }

  /** */
  private listMarkdownFiles(): string[] {
    return fs.readdirSync(this.cfg.srcDir)
      .filter(file => this.isMarkdownFile(file))
  }

  /** */
  private processMarkdownFile(
    file: string,
    content: string,
    partials: DocPartial[],
  ): string {
    const lines = content.split(/\r?\n/);

    let result = '';
    let lineNo = 1;
  // for each line
    for (const line of lines) {
      const match = PARTIAL_REGEX.exec(line);
      if (match) {
        const id = match[1];
        const partial = partials.find(itr => itr.id === id);
        if (!partial) {
          throw new Error(`Unknown partial ${id} in file ${file}:${lineNo}`);
        }
        result += partial.content + '\n';
      }
      else {
        result += line + '\n';
      }
      lineNo++;
    }
    return result;
  }

  /** */
  private buildMarkdownFile(file: string, partials: DocPartial[]): void {
  // read
    const srcFile = path.join(this.cfg.srcDir, file);
    const content = fs.readFileSync(srcFile).toString();

  // process
    const processed = this.processMarkdownFile(file, content, partials);

  // write
    const dstFile = path.join(this.cfg.dstDir, file);    
    fs.writeFileSync(dstFile, processed);
  }

  /** */
  run(partials: DocPartial[]): void {
    Log.section('*.md: build');
    const markdownFiles = this.listMarkdownFiles();
    markdownFiles.forEach(file => this.buildMarkdownFile(file, partials));
  }
}