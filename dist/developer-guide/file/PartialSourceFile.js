"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialSourceFile = void 0;
/** File name patterns to comment prefixes map. */
const FILE_PATTERNS_TO_COMMENT_PREFIXES = [
    {
        patterns: ['.js', '.ts', '.jsx', '.tsx'],
        prefixes: ['//']
    },
    {
        patterns: ['.h', '.c', '.cpp'],
        prefixes: ['//']
    },
    {
        patterns: ['.yaml', '.yml'],
        prefixes: ['#']
    },
    {
        patterns: [/^.*\/Makefile.*$/],
        prefixes: ['#']
    },
];
/** */
class PartialSourceFile {
    /** */
    static isPartialSourceFile(file) {
        const patterns = FILE_PATTERNS_TO_COMMENT_PREFIXES.flatMap(itr => itr.patterns);
        return PartialSourceFile.match(file, patterns);
    }
    /** */
    static match(file, patterns) {
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
    static getCommentPrefixes(file) {
        for (const entry of FILE_PATTERNS_TO_COMMENT_PREFIXES) {
            if (PartialSourceFile.match(file, entry.patterns)) {
                return entry.prefixes;
            }
        }
        return undefined;
    }
}
exports.PartialSourceFile = PartialSourceFile;
