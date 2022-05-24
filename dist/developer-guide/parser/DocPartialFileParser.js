"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocPartialFileParser = void 0;
const YAML = __importStar(require("yaml"));
const file_1 = require("../file");
/** */
const FRONT_MATTER_PREFIX = '--- ';
const DEV_GUIDE_ID = 'devGuideId';
/** */
var CommentBlockParserState;
(function (CommentBlockParserState) {
    CommentBlockParserState[CommentBlockParserState["FrontMatter"] = 0] = "FrontMatter";
    CommentBlockParserState[CommentBlockParserState["Content"] = 1] = "Content";
})(CommentBlockParserState || (CommentBlockParserState = {}));
;
/** */
class DocPartialFileParser {
    /** */
    matchPrefix(line, prefixes) {
        const trimmed = line.trim();
        for (const prefix of prefixes) {
            if (trimmed.startsWith(prefix)) {
                return trimmed.substring(prefix.length);
            }
        }
    }
    /** */
    parseFrontMatter(frontMatterLines) {
        const frontMatterContent = frontMatterLines.join('\n');
        const frontMatter = YAML.parse(frontMatterContent);
        if (!frontMatter[DEV_GUIDE_ID]) {
            throw new Error(`Missing ${DEV_GUIDE_ID}`);
        }
        return frontMatter;
    }
    /** */
    isDevGuideCommentBlock(commentBlock) {
        if (!commentBlock.length) {
            return false;
        }
        const line = commentBlock[0];
        return (line.startsWith(FRONT_MATTER_PREFIX) &&
            line.includes(DEV_GUIDE_ID + ':'));
    }
    /** */
    parseDevGuideCommentBlock(file, commentBlock, commentBlockLineNo) {
        // state
        let state = CommentBlockParserState.FrontMatter;
        let frontMatter;
        const content = [];
        const frontMatterLines = [];
        // for each comment line
        for (const line of commentBlock) {
            if (line.startsWith(FRONT_MATTER_PREFIX) &&
                state === CommentBlockParserState.FrontMatter) {
                frontMatterLines.push(line.substring(FRONT_MATTER_PREFIX.length));
            }
            else {
                if (state === CommentBlockParserState.FrontMatter) {
                    try {
                        frontMatter = this.parseFrontMatter(frontMatterLines);
                    }
                    catch (error) {
                        throw new Error(`Invalid front matter in file ${file} ` +
                            `in line ${commentBlockLineNo}: ${error.toString()}`);
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
    parse(file, content) {
        // get comment prefixes
        const prefixes = file_1.PartialSourceFile.getCommentPrefixes(file);
        if (!prefixes) {
            return [];
        }
        // split
        const lines = content.split(/\r?\n/);
        let lineNo = 1;
        const partials = [];
        const commentBlock = [];
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
                    : commentLine);
            }
            else if (this.isDevGuideCommentBlock(commentBlock)) {
                const partial = this.parseDevGuideCommentBlock(file, commentBlock, commentBlockLineNo);
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
            const partial = this.parseDevGuideCommentBlock(file, commentBlock, commentBlockLineNo);
            if (partial) {
                partials.push(partial);
            }
        }
        return partials;
    }
}
exports.DocPartialFileParser = DocPartialFileParser;
