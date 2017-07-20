/// <reference types="node" />
import { ReadStream } from 'fs';
export declare class FileStream {
    private stream;
    constructor(stream: ReadStream);
    setStream(stream: ReadStream): void;
    getStream(): ReadStream;
}
