export class Endpoint {

  public deployment: string
  public channel: string

  public constructor (deployment: string, channel: string) {
    this.deployment = deployment
    this.channel = channel
  }
}
