import * as fs from 'fs';

import { DevGuideCfg } from '../DevGuideCfg';
import { PartialSourceFile } from '../file';
import { walkSync } from '../io';
import { DocPartialFileParser } from '../parser';
import { DocPartial } from '../partial';

/** */
export class DocPartialCrawler {
  /** */
  constructor(private readonly cfg: DevGuideCfg) {
  }

  /** */
  private findFilesInDir(dir: string): string[] {
    const files: string[] = [];
    walkSync(dir, (fullPath: string, isDir: boolean) => {
      if (!isDir && PartialSourceFile.isPartialSourceFile(fullPath)) {
        files.push(fullPath);
      }
      return isDir;
    });
    return files;
  }

  /** */
  private findFiles(): string[] {
    return this.cfg.partialSrcDirs.flatMap(dir => this.findFilesInDir(dir));
  }

  /** */
  readPartials(): DocPartial[] {
    const files = this.findFiles();
    const partials: DocPartial[] = [];

  // for each file
    files.forEach(file => {
    // read
      const content = fs.readFileSync(file).toString();

    // parse
      const parser = new DocPartialFileParser();
      const filePartials = parser.parse(file, content);

    // check duplicates
      filePartials.forEach(filePartial => {
        const { id } = filePartial;

      // within the file
        const count = filePartials
          .map(itr => itr.id === id ? 1 : 0)
          .reduce((current, previous) => {
            return previous + current;
          }, 0);
        if (count > 1) {
          throw new Error(
            `Duplicated partial ${id} in file ${filePartial.file}`,
          );
        }
      
      // in other files
        const duplicatedPartial = partials.find(partial => partial.id === id);
        if (duplicatedPartial) {
          throw new Error(
            `Duplicated partial ${id} in files ` +
            `${duplicatedPartial.file} and ${filePartial.file}`,
          );
        }

      // add
        partials.push(filePartial);
      });
    });

    return partials;
  }
}