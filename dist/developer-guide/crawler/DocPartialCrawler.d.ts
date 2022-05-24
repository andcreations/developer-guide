import { DevGuideCfg } from '../DevGuideCfg';
import { DocPartial } from '../partial';
/** */
export declare class DocPartialCrawler {
    private readonly cfg;
    /** */
    constructor(cfg: DevGuideCfg);
    /** */
    private findFilesInDir;
    /** */
    private findFiles;
    /** */
    readPartials(): DocPartial[];
}
