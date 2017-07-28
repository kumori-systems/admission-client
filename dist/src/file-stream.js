"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is only a holder for bundle or manifest references. If admission
 * client is on a browser, FileStream expects receiving File or Blob objects. If
 * admission client is on Node, it expects receiving ReadStream objects.
 */
class FileStream {
    constructor(stream) {
        this.stream = stream;
    }
    setStream(stream) {
        this.stream = stream;
    }
    getStream() {
        return this.stream;
    }
}
exports.FileStream = FileStream;
//# sourceMappingURL=file-stream.js.map