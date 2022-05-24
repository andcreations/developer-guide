/** */
export interface DevGuideCfg {
  /** Directory with documentation source files. */
  srcDir: string;

  /** Directories with source code files from which to pull partials. */
  partialSrcDirs: string[];

  /** Directory for built documentation. */
  dstDir: string;

  /** Page title. */
  title: string;

  /** Name displayed in the sidebar. */
  name: string;

  /** Short documentation description. */
  description: string;
}