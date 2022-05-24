import { DocPartial } from '../partial';
/** */
export declare class DocPartialFileParser {
    /** */
    private matchPrefix;
    /** */
    private parseFrontMatter;
    /** */
    private isDevGuideCommentBlock;
    /** */
    private parseDevGuideCommentBlock;
    /** */
    parse(file: string, content: string): DocPartial[];
}
