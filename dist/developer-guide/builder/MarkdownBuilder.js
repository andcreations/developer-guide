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
exports.MarkdownBuilder = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Log_1 = require("../Log");
/** */
const PARTIAL_REGEX = /^\$partial<(.+)>$/;
/** */
class MarkdownBuilder {
    /** */
    constructor(cfg) {
        this.cfg = cfg;
    }
    /** */
    isMarkdownFile(file) {
        return file.endsWith('.md');
    }
    /** */
    listMarkdownFiles() {
        return fs.readdirSync(this.cfg.srcDir)
            .filter(file => this.isMarkdownFile(file));
    }
    /** */
    processMarkdownFile(file, content, partials) {
        const lines = content.split(/\r?\n/);
        let result = '';
        let lineNo = 1;
        // for each line
        for (const line of lines) {
            const match = PARTIAL_REGEX.exec(line);
            if (match) {
                const id = match[1];
                const partial = partials.find(itr => itr.id === id);
                if (!partial) {
                    throw new Error(`Unknown partial ${id} in file ${file}:${lineNo}`);
                }
                result += partial.content + '\n';
            }
            else {
                result += line + '\n';
            }
            lineNo++;
        }
        return result;
    }
    /** */
    buildMarkdownFile(file, partials) {
        // read
        const srcFile = path.join(this.cfg.srcDir, file);
        const content = fs.readFileSync(srcFile).toString();
        // process
        const processed = this.processMarkdownFile(file, content, partials);
        // write
        const dstFile = path.join(this.cfg.dstDir, file);
        fs.writeFileSync(dstFile, processed);
    }
    /** */
    run(partials) {
        Log_1.Log.section('*.md: build');
        const markdownFiles = this.listMarkdownFiles();
        markdownFiles.forEach(file => this.buildMarkdownFile(file, partials));
    }
}
exports.MarkdownBuilder = MarkdownBuilder;
