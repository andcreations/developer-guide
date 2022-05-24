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
exports.DocPartialCrawler = void 0;
const fs = __importStar(require("fs"));
const file_1 = require("../file");
const io_1 = require("../io");
const parser_1 = require("../parser");
/** */
class DocPartialCrawler {
    /** */
    constructor(cfg) {
        this.cfg = cfg;
    }
    /** */
    findFilesInDir(dir) {
        const files = [];
        (0, io_1.walkSync)(dir, (fullPath, isDir) => {
            if (!isDir && file_1.PartialSourceFile.isPartialSourceFile(fullPath)) {
                files.push(fullPath);
            }
            return isDir;
        });
        return files;
    }
    /** */
    findFiles() {
        return this.cfg.partialSrcDirs.flatMap(dir => this.findFilesInDir(dir));
    }
    /** */
    readPartials() {
        const files = this.findFiles();
        const partials = [];
        // for each file
        files.forEach(file => {
            // read
            const content = fs.readFileSync(file).toString();
            // parse
            const parser = new parser_1.DocPartialFileParser();
            const filePartials = parser.parse(file, content);
            // check duplicates
            filePartials.forEach(filePartial => {
                const { id } = filePartial;
                // within the file
                const count = filePartials
                    .map(itr => itr.id === id ? 1 : 0)
                    .reduce((current, previous) => {
                    return previous + current;
                }, 0);
                if (count > 1) {
                    throw new Error(`Duplicated partial ${id} in file ${filePartial.file}`);
                }
                // in other files
                const duplicatedPartial = partials.find(partial => partial.id === id);
                if (duplicatedPartial) {
                    throw new Error(`Duplicated partial ${id} in files ` +
                        `${duplicatedPartial.file} and ${filePartial.file}`);
                }
                // add
                partials.push(filePartial);
            });
        });
        return partials;
    }
}
exports.DocPartialCrawler = DocPartialCrawler;
