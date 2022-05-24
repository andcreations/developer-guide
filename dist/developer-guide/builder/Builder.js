"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const crawler_1 = require("../crawler");
const IndexHTMLBuilder_1 = require("./IndexHTMLBuilder");
const MarkdownBuilder_1 = require("./MarkdownBuilder");
/** */
class Builder {
    /** */
    constructor(cfg) {
        this.cfg = cfg;
    }
    /** */
    run() {
        // index.html
        const indexHtmlBuilder = new IndexHTMLBuilder_1.IndexHTMLBuilder(this.cfg);
        indexHtmlBuilder.run();
        // read partials
        const crawler = new crawler_1.DocPartialCrawler(this.cfg);
        const partials = crawler.readPartials();
        // *.md
        const markdownBuilder = new MarkdownBuilder_1.MarkdownBuilder(this.cfg);
        markdownBuilder.run(partials);
    }
}
exports.Builder = Builder;
