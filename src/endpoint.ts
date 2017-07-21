export class Endpoint {

  public constructor(deployment:string, channel:string){
    this.deployment = deployment;
    this.channel = channel;
  }

  public deployment: string;
  public channel: string;
}
