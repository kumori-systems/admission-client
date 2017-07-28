export class FileStream {

  private stream: File|Blob

  public constructor (stream: File|Blob) {
    this.stream = stream
  }

  public setStream (stream: File|Blob): void {
    this.stream = stream
  }

  public getStream (): File|Blob {
    return this.stream
  }

}
