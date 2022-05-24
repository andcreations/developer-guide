import { DevGuideCfg } from '../DevGuideCfg';
import { DocPartial } from '../partial';
/** */
export declare class MarkdownBuilder {
    private readonly cfg;
    /** */
    constructor(cfg: DevGuideCfg);
    /** */
    private isMarkdownFile;
    /** */
    private listMarkdownFiles;
    /** */
    private processMarkdownFile;
    /** */
    private buildMarkdownFile;
    /** */
    run(partials: DocPartial[]): void;
}
