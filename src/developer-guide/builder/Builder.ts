import { DocPartialCrawler } from '../crawler';
import { DevGuideCfg } from '../DevGuideCfg';

import { IndexHTMLBuilder } from './IndexHTMLBuilder';
import { MarkdownBuilder } from './MarkdownBuilder';

/** */
export class Builder {
  /** */
  constructor(private readonly cfg: DevGuideCfg) {
  }

  /** */
  run(): void {
  // index.html
    const indexHtmlBuilder = new IndexHTMLBuilder(this.cfg);
    indexHtmlBuilder.run();

  // read partials
    const crawler = new DocPartialCrawler(this.cfg);
    const partials = crawler.readPartials();

  // *.md
    const markdownBuilder = new MarkdownBuilder(this.cfg);
    markdownBuilder.run(partials);
  }
}