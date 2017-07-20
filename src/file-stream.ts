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