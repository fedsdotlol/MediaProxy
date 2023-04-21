"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamFromBuffer = void 0;
const stream_1 = require("stream");
function getStreamFromBuffer(buffer) {
    const stream = new stream_1.Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}
exports.getStreamFromBuffer = getStreamFromBuffer;
