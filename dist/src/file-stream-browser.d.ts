export declare class FileStream {
    private stream;
    constructor(stream: File | Blob);
    setStream(stream: File | Blob): void;
    getStream(): File | Blob;
}
