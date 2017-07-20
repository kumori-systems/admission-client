import {ReadStream} from 'fs';

export class FileStream{

  private stream: ReadStream;

  public constructor(stream: ReadStream) {
    this.stream = stream;
  }

  public setStream(stream: ReadStream): void {
    this.stream = stream;
  }

  public getStream():ReadStream {
    return this.stream;
  }
  
}