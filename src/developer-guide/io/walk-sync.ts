import * as fs from 'fs';
import * as path from 'path';

/** */
export interface WalkSyncFilter {
  /** */
  (fullPath: string, isDir: boolean): boolean;
}

/** */
export function walkSync(
  dir: string,
  filter?: WalkSyncFilter,
): string[] {
  const files: string[] = [];
  const dirFiles = fs.readdirSync(dir);
  dirFiles.forEach(dirFile => {
    const fullPath = path.join(dir, dirFile);
    if (fs.lstatSync(fullPath).isDirectory()) {
      if (!filter || filter(fullPath, true)) {
        files.push(fullPath);

      // step into the subdirectory
        const subDirFiles = walkSync(fullPath, filter);
        subDirFiles.forEach(subDirFile => files.push(subDirFile));
      }
    }
    else {
      if (!filter || filter(fullPath, false)) {
        files.push(fullPath);
      }
    }
  });

  return files;
}