import * as YAML from 'yaml';
import { CommentPrefixes, PartialSourceFile } from '../file';
import {  DocPartialFrontMatter, DocPartial } from '../partial';

/** */
const FRONT_MATTER_PREFIX = '--- ';
const DEV_GUIDE_ID = 'devGuideId';

/** */
enum CommentBlockParserState {
  FrontMatter,
  Content,
};

/** */
export class DocPartialFileParser {
  /** */
  private matchPrefix(line: string, prefixes: CommentPrefixes): string {
    const trimmed = line.trim();
    for (const prefix of prefixes) {
      if (trimmed.startsWith(prefix)) {
        return trimmed.substring(prefix.length);
      }
    }
  }

  /** */
  private parseFrontMatter(
    frontMatterLines: string[],
  ): DocPartialFrontMatter {
    const frontMatterContent = frontMatterLines.join('\n');
    const frontMatter = YAML.parse(frontMatterContent);
    if (!frontMatter[DEV_GUIDE_ID]) {
      throw new Error(`Missing ${DEV_GUIDE_ID}`);
    }
    return frontMatter as DocPartialFrontMatter;
  }

  /** */
  private isDevGuideCommentBlock(commentBlock: string[]): boolean {
    if (!commentBlock.length) {
      return false;
    }
    const line = commentBlock[0];
    return (
      line.startsWith(FRONT_MATTER_PREFIX) &&
      line.includes(DEV_GUIDE_ID + ':')
    );
  }

  /** */
  private parseDevGuideCommentBlock(
    file: string,
    commentBlock: string[],
    commentBlockLineNo: number,
  ): DocPartial {
  // state
    let state = CommentBlockParserState.FrontMatter;

    let frontMatter: DocPartialFrontMatter;
    const content: string[] = [];
    const frontMatterLines: string[] = [];
  // for each comment line
    for (const line of commentBlock) {
      if (line.startsWith(FRONT_MATTER_PREFIX) &&
          state === CommentBlockParserState.FrontMatter
      ) {
        frontMatterLines.push(line.substring(FRONT_MATTER_PREFIX.length));
      }
      else {
        if (state === CommentBlockParserState.FrontMatter) {
          try {
            frontMatter = this.parseFrontMatter(frontMatterLines);
          } catch (error) {
            throw new Error(
              `Invalid front matter in file ${file} ` +
              `in line ${commentBlockLineNo}: ${error.toString()}`,
            );
          }
        }        
        state = CommentBlockParserState.Content;
        content.push(line);
      }
    }

    return {
      id: frontMatter.devGuideId,
      file,
      frontMatter,
      content: content.join('\n'),
    };
  }

  /** */
  parse(file: string, content: string): DocPartial[] {
  // get comment prefixes
    const prefixes = PartialSourceFile.getCommentPrefixes(file);
    if (!prefixes) {
      return [];
    }

  // split
    const lines = content.split(/\r?\n/);
    let lineNo = 1;

    const partials: DocPartial[] = [];
    const commentBlock: string[] = [];
    let commentBlockLineNo;
  // for each line
    for (const line of lines) {
      const commentLine = this.matchPrefix(line, prefixes);
      if (commentLine != null) {
        if (!commentBlock.length) {
          commentBlockLineNo = lineNo;
        }
        commentBlock.push(commentLine.startsWith(' ')
          ? commentLine.substring(1)
          : commentLine
        );
      }
      else if (this.isDevGuideCommentBlock(commentBlock)) {
        const partial = this.parseDevGuideCommentBlock(
          file,
          commentBlock,
          commentBlockLineNo,
        );
        if (partial) {
          partials.push(partial);
        }
        commentBlock.length = 0;
      }
      else {
        commentBlock.length = 0;
      }
      lineNo++;
    }

  // the very last partial
    if (this.isDevGuideCommentBlock(commentBlock)) {
      const partial = this.parseDevGuideCommentBlock(
        file,
        commentBlock,
        commentBlockLineNo,
      );
      if (partial) {
        partials.push(partial);
      }
    }

    return partials;
  }
}