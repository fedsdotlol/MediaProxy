import { Duplex } from "stream";

export function getStreamFromBuffer(buffer: Buffer): Duplex {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}
