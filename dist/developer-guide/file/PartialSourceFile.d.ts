/** */
export declare type CommentPrefixes = string[];
/** */
export declare type FileNamePattern = string | RegExp;
/** */
interface FilePatternsToCommentPrefixes {
    /** File name patterns. */
    patterns: Array<FileNamePattern>;
    /** Comment prefixes. */
    prefixes: CommentPrefixes;
}
/** */
export declare class PartialSourceFile {
    /** */
    static isPartialSourceFile(file: string): boolean;
    /** */
    static match(file: string, patterns: FilePatternsToCommentPrefixes['patterns']): boolean;
    /** */
    static getCommentPrefixes(file: string): CommentPrefixes | undefined;
}
export {};
