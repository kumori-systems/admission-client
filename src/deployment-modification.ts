export abstract class DeploymentModification {
  public deploymentURN: string
  protected action: string
  public abstract generate (): any

  protected generateBase (): any {
    return {
      action: this.action,
      deploymentUrn: this.deploymentURN
    }
  }
}
