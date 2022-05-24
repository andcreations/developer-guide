/** */
export type CommentPrefixes = string[];

/** */
export type FileNamePattern = string | RegExp;

/** */
interface FilePatternsToCommentPrefixes {
  /** File name patterns. */
  patterns: Array<FileNamePattern>;

  /** Comment prefixes. */
  prefixes: CommentPrefixes;
}

/** File name patterns to comment prefixes map. */
const FILE_PATTERNS_TO_COMMENT_PREFIXES: FilePatternsToCommentPrefixes[] = [
  {
    patterns: ['.js', '.ts', '.jsx', '.tsx'],
    prefixes: ['//']
  },
  {
    patterns: ['.h','.c','.cpp'],
    prefixes: ['//']
  },
  {
    patterns: ['.yaml','.yml'],
    prefixes: ['#']
  },
  {
    patterns: [/^.*\/Makefile.*$/],
    prefixes: ['#']
  },
];

/** */
export class PartialSourceFile {
  /** */
  static isPartialSourceFile(file: string): boolean {
    const patterns = FILE_PATTERNS_TO_COMMENT_PREFIXES.flatMap(
      itr => itr.patterns
    );
    return PartialSourceFile.match(file, patterns);
  }

  /** */
  static match(
    file: string,
    patterns: FilePatternsToCommentPrefixes['patterns'],
  ): boolean {
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (file.endsWith(pattern)) {
          return true;
        }
      }
      else if (pattern instanceof RegExp) {
        if (pattern.test(file)) {
          return true;
        }
      }
    }
    return false;
  }

  /** */
  static getCommentPrefixes(file: string): CommentPrefixes | undefined {
    for (const entry of FILE_PATTERNS_TO_COMMENT_PREFIXES) {
      if (PartialSourceFile.match(file, entry.patterns)) {
        return entry.prefixes;
      }
    }
    return undefined;
  }
}