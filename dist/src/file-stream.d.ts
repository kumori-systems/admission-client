/**
 * This class is only a holder for bundle or manifest references. If admission
 * client is on a browser, FileStream expects receiving File or Blob objects. If
 * admission client is on Node, it expects receiving ReadStream objects.
 */
export declare class FileStream {
    private stream;
    constructor(stream: any);
    setStream(stream: any): void;
    getStream(): any;
}
