"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevGuide = void 0;
const Log_1 = require("./Log");
const builder_1 = require("./builder");
/** */
class DevGuide {
    /** */
    constructor(cfg) {
        this.cfg = cfg;
    }
    /** */
    run(args) {
        const command = args[0];
        // build
        if (command === 'build') {
            const builder = new builder_1.Builder(this.cfg);
            builder.run();
            return;
        }
        Log_1.Log.fatal(`Unknown command ${command}`);
    }
}
exports.DevGuide = DevGuide;
