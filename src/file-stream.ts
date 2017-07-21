/**
 * This class is only a holder for bundle or manifest references. If admission
 * client is on a browser, FileStream expects receiving File or Blob objects. If
 * admission client is on Node, it expects receiving ReadStream objects.
 */
export class FileStream{

  private stream: any;

  public constructor(stream: any) {
    this.stream = stream;
  }

  public setStream(stream: any): void {
    this.stream = stream;
  }

  public getStream():any {
    return this.stream;
  }
  
}